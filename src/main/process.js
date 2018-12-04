import log from 'electron-log'
import respawn from 'respawn'
import path from 'path'
import fs from 'fs'
import stringArgv from 'string-argv'
import equal from 'deep-equal'
import moment from 'moment'

import { CasparCGHealthMonitor } from './casparcg'

export class ProcessMonitor {
  constructor (id, ipcWrapper, config) {
    this.id = id
    this.ipcWrapper = ipcWrapper
    this.currentStatus = 'stopped'

    this.ipcWrapper.on(this.id + '.control', (sender, cmd) => {
      log.info('[' + this.id + '] Got process control command : ' + cmd)
      if (cmd === 'stop') {
        this.stop()
      } else if (cmd === 'start') {
        this.start()
      } else if (cmd === 'restart') {
        this.restart()
      }
    })

    this.updateConfig(config)
  }

  updateConfig (newConfig) {
    const changed = !equal(newConfig, this.config)

    this.config = newConfig
    this.config.exeName = this.config.exeName || ''

    this.logFile = !!this.config.logMode

    if (changed) {
      if (this.healthMon) {
        this.healthMon.stop()
        this.healthMon = undefined
      }

      switch (this.config.health) {
        case 'casparcg':
          this.healthMon = new CasparCGHealthMonitor(this)
          break
      }

      this.reinit()
    }
  }

  reinit () {
    const restart = this.running()
    if (this.process) {
      this.process.stop(() => this.init(restart))
    } else {
      this.init(false)
    }
  }

  init (start) {
    const basePath = this.config.basePath

    let procPath = this.config.exeName
    if (!path.isAbsolute(procPath)) {
      procPath = path.join(basePath, procPath)
    }

    log.info(`[${this.id}] Booting Process ${procPath}`)

    let fileExists
    try {
      const exeStat = fs.statSync(procPath)
      fileExists = exeStat.isFile()
    } catch (e) {
      fileExists = false
    }
    if (!fileExists) {
      log.info('[' + this.id + '] Executable does not exist: ' + procPath)
      this.pipeLog('event', '== Executable does not exist ==')
      this.pipeStatus('failed')
      return
    }

    const args = this.config.args || ''
    this.process = respawn(
      [this.config.exeName].concat(stringArgv(args)), {
        cwd: basePath
      }
    )

    this.process.on('start', () => {
      if (this.healthMon) {
        this.healthMon.start()
      }

      log.info('[' + this.id + '] ' + this.config.exeName + ' start')
      this.pipeLog('event', '== Process has started ==')
      this.pipeStatus('running')
    })
    this.process.on('stdout', (data) => {
      this.pipeLog('log', data)
    })
    this.process.on('stderr', (data) => {
      this.pipeLog('log', data)
    })
    this.process.on('stop', () => {
      log.info('[' + this.id + '] ' + this.config.exeName + ' stop')
      if (this.healthMon) {
        this.healthMon.stop()
      }

      this.pipeLog('event', '== Process has stopped ==')
      this.pipeStatus('stopped')
    })
    this.process.on('crash', () => {
      log.info('[' + this.id + '] ' + this.config.exeName + ' crash')
      this.pipeLog('event', '== Process has crashed ==')
    })
    this.process.on('sleep', () => {
      log.info('[' + this.id + '] ' + this.config.exeName + ' sleep')
      this.pipeLog('event', '== Process is sleeping ==')
    })
    this.process.on('spawn', (process) => {
      log.info('[' + this.id + '] ' + this.config.exeName + ' spawn ' + process.pid)

      this.pipeLog('event', '== Process is starting ==')
    })
    this.process.on('exit', (code, signal) => {
      log.info('[' + this.id + '] ' + this.config.exeName + ' exit ' + code + ' ' + signal)

      this.pipeLog('event', '== Process has exited with code ' + code + ' ==')
    })

    if (start) {
      this.process.start()
    }
  }

  running () {
    return this.process && this.process.status === 'running'
  }

  start () {
    if (this.process) {
      this.process.start()
    }
  }

  stop (cb) {
    if (this.process) {
      this.process.stop(cb)
    }
  }

  restart () {
    this.stop(() => this.start())
  }

  pipeLog (type, msg) {
    let content = [msg.toString()]

    if (type === 'log') {
      content = content[0].trim().split('\n')
    }

    content.forEach(l => {
      this.ipcWrapper.send('process.log', JSON.stringify({
        id: this.id,
        data: {
          type: type,
          content: l
        }
      }))
    })

    this.ensureLogFileHandleCorrect()
    if (this.logFileStream) {
      let fullMsg = msg.toString()
      if (type === 'event') {
        fullMsg += '\r\n'
      }

      this.logFileStream.write(fullMsg)
    }
  }
  pipeStatus (status) {
    this.currentStatus = status
    this.ipcWrapper.send('process.status', JSON.stringify({ id: this.id, status: status }))
  }

  ensureLogFileHandleCorrect () {
    if (!this.logFile) {
      if (this.logFileStream) {
        this.logFileStream.end()
        this.logFileStream = undefined
        log.info('[' + this.id + '] Closed log')
      }
      return
    }

    const targetName = this.config.name + '_' + moment().format('YYYY-MM-DD') + '.log'
    if (targetName === this.logFile) {
      // Correct handle already open
      return
    }

    // Need to update file handle
    if (this.logFileStream) {
      this.logFileStream.end()
      this.logFileStream = undefined
      log.info('[' + this.id + '] Closed log')
    }

    // Ensure folder exists
    const logBasePath = path.join(this.config.basePath, 'logs')
    try {
      fs.mkdirSync(logBasePath, { recursive: true })
    } catch (e) {
      // Ignore. It most likely already exists, otherwise below will fail just as well
    }

    // Open new file
    const logPath = path.join(logBasePath, targetName)
    this.logFileStream = fs.createWriteStream(logPath, {flags: 'a'})
    this.logFile = targetName
    log.info('[' + this.id + '] Opened log: ' + targetName)
  }
}
