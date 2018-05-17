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
      this.logToStream('event', '== Process has started ==')
    })
    this.process.on('stdout', (data) => {
      this.logToStream('log', data.toString())
    })
    this.process.on('stderr', (data) => {
      log.info(exeName + ' stderr')

      this.logToStream('error', data.toString())
    })
    this.process.on('stop', () => {
      log.info(exeName + ' stop')

      this.logToStream('event', '== Process has stopped ==')
    })
    this.process.on('crash', () => {
      log.info(exeName + ' crash')
      this.logToStream('event', '== Process has crashed ==')
    })
    this.process.on('sleep', () => {
      log.info(exeName + ' sleep')
      this.logToStream('event', '== Process is sleeping ==')
    })
    this.process.on('spawn', (process) => {
      log.info(exeName + ' spawn ' + process.pid)

      this.logToStream('event', '== Process is starting ==')
    })
    this.process.on('exit', (code, signal) => {
      log.info(exeName + ' exit ' + code + ' ' + signal)

      this.logToStream('event', '== Process has exited with code ' + code + ' ==')
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

  logToStream (type, msg) {
    this.ipcWrapper.send(this.id + '.log', JSON.stringify({
      type: type,
      content: msg
    }))
  }
}
