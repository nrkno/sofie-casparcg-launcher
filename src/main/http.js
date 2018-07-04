import express from 'express'
import path from 'path'
import serveIndex from 'serve-index'

export class HttpMonitor {
  constructor (config, processes) {
    this.config = config
    this.processes = processes

    config.onDidChange('basePath', () => this.reinit())
    config.onDidChange('api.port', () => this.reinit())
    config.onDidChange('api.enable', () => this.reinit())
    config.onDidChange('api.staticPaths', () => this.reinit())
    config.onDidChange('api.processControl', () => this.reinit())
    this.init(true)
  }

  reinit () {
    if (this.server) {
      this.server.close(() => this.init(true))
    } else {
      this.init(false)
    }
  }

  stop () {
    if (this.server) {
      this.server.close()
    }
  }

  init () {
    if (!this.config.get('api.enable', false)) {
      this.server = null
      return
    }

    const app = express()

    if (this.config.get('api.processControl', false)) {
      app.get('/processes/:id', (req, res) => {
        const props = this.processes[req.params.id]
        if (!props) {
          return res.sendStatus(404)
        }

        res.send(props.currentStatus)
      })

      app.post('/processes/:id/stop', (req, res) => {
        const props = this.processes[req.params.id]
        if (!props) {
          return res.sendStatus(404)
        }

        props.stop()
        res.send({})
      })

      app.post('/processes/:id/start', (req, res) => {
        const props = this.processes[req.params.id]
        if (!props) {
          return res.sendStatus(404)
        }

        props.start()
        res.send({})
      })

      app.post('/processes/:id/restart', (req, res) => {
        const props = this.processes[req.params.id]
        if (!props) {
          return res.sendStatus(404)
        }

        props.restart()
        res.send({})
      })

      app.get('/processes', (req, res) => {
        res.send(Object.keys(this.processes))
      })
    }

    // Bind any static paths from the host machine
    const staticPaths = this.config.get('api.staticPaths', [])
    if (staticPaths.length > 0) {
      let basePath = this.config.get('basePath', './')
      if (!path.isAbsolute(basePath)) {
        basePath = path.join(process.env.PORTABLE_EXECUTABLE_DIR, basePath)
      }

      for (let p of staticPaths) {
        if (!path.isAbsolute(p.path)) {
          p.path = path.join(basePath, p.path)
        }

        app.use('/' + p.name, express.static(p.path), serveIndex(p.path))
      }
    }

    const port = this.config.get('api.port', 8005)
    this.server = app.listen(port, () => console.log(`http api listening on port ${port}!`))
  }
}
