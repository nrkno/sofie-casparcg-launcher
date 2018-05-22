import log from 'electron-log'
import respawn from 'respawn'
import path from 'path'
import fs from 'fs'
import stringArgv from 'string-argv'

export class ProcessMonitor {
  constructor (id, ipcWrapper, config, exeName, healthMon) {
    this.id = id
    this.ipcWrapper = ipcWrapper
    this.config = config
    this.exeName = exeName
    this.healthMon = healthMon
    this.currentStatus = 'stopped'

    if (this.healthMon) {
      this.healthMon.init(this)
    }

    this.ipcWrapper.on(this.id + '.control', (sender, cmd) => {
      log.info('Got process control command for ' + this.id + ': ' + cmd)
      if (cmd === 'stop') {
        this.stop()
      } else if (cmd === 'start') {
        this.start()
      } else if (cmd === 'restart') {
        this.restart()
      }
    })

    config.onDidChange('basePath', () => this.reinit())
    config.onDidChange('args.' + id, () => this.reinit())
    this.init(true)
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
    const basePath = this.config.get('basePath', './')
    const procPath = path.join(basePath, this.exeName)
    log.info(`Booting Process ${procPath}`)

    let fileExists
    try {
      const exeStat = fs.statSync(procPath)
      fileExists = exeStat.isFile()
    } catch (e) {
      fileExists = false
    }
    if (!fileExists) {
      log.info('Executable does not exist: ' + procPath)
      this.pipeLog('event', '== Executable does not exist ==')
      this.pipeStatus('failed')
      return
    }

    const args = this.config.get('args.' + this.id, '')
    this.process = respawn(
      [this.exeName].concat(stringArgv(args)), {
        cwd: basePath
      }
    )

    this.process.on('start', () => {
      if (this.healthMon) {
        this.healthMon.start()
      }

      this.pipeLog('event', '== Process has started ==')
      this.pipeStatus('running')
    })
    this.process.on('stdout', (data) => {
      const lines = data.toString().trim().split('\n')
      lines.forEach(l => this.pipeLog('log', l))
    })
    this.process.on('stderr', (data) => {
      log.info(this.exeName + ' stderr')

      const lines = data.toString().trim().split('\r\n')
      lines.forEach(l => this.pipeLog('error', l))
    })
    this.process.on('stop', () => {
      log.info(this.exeName + ' stop')
      if (this.healthMon) {
        this.healthMon.stop()
      }

      this.pipeLog('event', '== Process has stopped ==')
      this.pipeStatus('stopped')
    })
    this.process.on('crash', () => {
      log.info(this.exeName + ' crash')
      this.pipeLog('event', '== Process has crashed ==')
    })
    this.process.on('sleep', () => {
      log.info(this.exeName + ' sleep')
      this.pipeLog('event', '== Process is sleeping ==')
    })
    this.process.on('spawn', (process) => {
      log.info(this.exeName + ' spawn ' + process.pid)

      this.pipeLog('event', '== Process is starting ==')
    })
    this.process.on('exit', (code, signal) => {
      log.info(this.exeName + ' exit ' + code + ' ' + signal)

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
    this.ipcWrapper.send(this.id + '.log', JSON.stringify({
      type: type,
      content: msg
    }))
  }
  pipeStatus (status) {
    this.currentStatus = status
    this.ipcWrapper.send(this.id + '.status', status)
  }
}
