import net from 'net'
import log from 'electron-log'

const startupDelay = 5000
const pingInterval = 5000
const pingTimeout = 8000

export class CasparCGHealthMonitor {
  init (procMon) {
    this.procMon = procMon
  }

  start () {
    if (!this.procMon) {
      return
    }

    this.client = new net.Socket()
    setTimeout(() => {
      this.client.connect(5250, '127.0.0.1', () => this.startPingTimer())

      this.client.on('close', () => {
        log.info('[' + this.procMon.id + '] ping connection closed')
        this.stopPingTimer()

        if (this.interval && this.procMon.running()) {
          this.procMon.stop(() => this.procMon.start())
        }
      })
      this.client.on('data', d => {
        // We don't care what we got, this proves caspar is alive and responding
        this.lastReceived = Date.now()
      })
      this.client.on('error', e => {
        if (this.interval && this.procMon.running()) {
          log.error('[' + this.procMon.id + '] ' + e)
          this.procMon.stop(() => this.procMon.start())
        }
      })
    }, startupDelay)
  }

  startPingTimer () {
    if (this.interval) {
      return
    }

    log.info('[' + this.procMon.id + '] ping timer starting')

    this.lastReceived = Date.now()
    this.interval = setInterval(() => {
      if (Date.now() - this.lastReceived > pingTimeout) {
        log.warn('[' + this.procMon.id + '] ping timeout')
        this.procMon.stop(() => this.procMon.start())
        return
      }

      this.client.write('PING\r\n')
    }, pingInterval)
  }

  stopPingTimer () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  stop () {
    if (!this.client) {
      return
    }

    this.stopPingTimer()
    this.client.end()
  }
}
