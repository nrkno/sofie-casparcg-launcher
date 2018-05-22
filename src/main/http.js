import express from 'express'

export default function (config, processes) {
  const app = express()

  app.get('/processes/:id', (req, res) => {
    const props = processes[req.params.id]
    if (!props) {
      return res.sendStatus(404)
    }

    res.send(props.currentStatus)
  })

  app.post('/processes/:id/stop', (req, res) => {
    const props = processes[req.params.id]
    if (!props) {
      return res.sendStatus(404)
    }

    props.stop()
    res.send({})
  })

  app.post('/processes/:id/start', (req, res) => {
    const props = processes[req.params.id]
    if (!props) {
      return res.sendStatus(404)
    }

    props.start()
    res.send({})
  })

  app.post('/processes/:id/restart', (req, res) => {
    const props = processes[req.params.id]
    if (!props) {
      return res.sendStatus(404)
    }

    props.restart()
    res.send({})
  })

  app.get('/processes', (req, res) => {
    res.send(Object.keys(processes))
  })

  const port = config.get('api.port', 8005)
  app.listen(port, () => console.log(`http api listening on port ${port}!`))
}
