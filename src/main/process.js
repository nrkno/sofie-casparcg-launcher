const log = require('electron-log')
const respawn = require('respawn')
const path = require('path')

export class ProcessMonitor {
  constructor (id, ipcWrapper, basePath, exeName) {
    this.id = id
    this.ipcWrapper = ipcWrapper

    const procPath = path.join(basePath, exeName)
    log.info(`Booting Process ${procPath}`)
    this.process = respawn(
      [exeName], {
        cwd: basePath
      }
    )

    this.process.on('start', () => {
      this.pipeLog('event', '== Process has started ==')
      this.pipeStatus('running')
    })
    this.process.on('stdout', (data) => {
      const lines = data.toString().trim().split('\n')
      lines.forEach(l => this.pipeLog('log', l))
    })
    this.process.on('stderr', (data) => {
      log.info(exeName + ' stderr')

      const lines = data.toString().trim().split('\r\n')
      lines.forEach(l => this.pipeLog('error', l))
    })
    this.process.on('stop', () => {
      log.info(exeName + ' stop')

      this.pipeLog('event', '== Process has stopped ==')
      this.pipeStatus('stopped')
    })
    this.process.on('crash', () => {
      log.info(exeName + ' crash')
      this.pipeLog('event', '== Process has crashed ==')
    })
    this.process.on('sleep', () => {
      log.info(exeName + ' sleep')
      this.pipeLog('event', '== Process is sleeping ==')
    })
    this.process.on('spawn', (process) => {
      log.info(exeName + ' spawn ' + process.pid)

      this.pipeLog('event', '== Process is starting ==')
    })
    this.process.on('exit', (code, signal) => {
      log.info(exeName + ' exit ' + code + ' ' + signal)

      this.pipeLog('event', '== Process has exited with code ' + code + ' ==')
    })

    this.ipcWrapper.on(id + '.control', (a, b) => {
      log.info(b)
      if (b === 'stop') {
        this.stop()
      } else if (b === 'start') {
        this.start()
      } else if (b === 'restart') {
        this.stop(() => {
          // TODO - doesnt work
          this.start()
        })
      }
    })

    this.process.start() // TODO - optional + stop control
  }

  start () {
    this.process.start() // TODO - ensure not already
  }

  stop () {
    this.process.stop()
  }

  pipeLog (type, msg) {
    this.ipcWrapper.send(this.id + '.log', JSON.stringify({
      type: type,
      content: msg
    }))
  }
  pipeStatus (status) {
    this.ipcWrapper.send(this.id + '.status', status)
  }
}
