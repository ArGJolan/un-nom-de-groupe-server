const express = require('express')
// const authRoute = require('./auth')
const bodyParser = require('body-parser')
const controller = require('./controller/')
const cors = require('cors')
const Session = require('./session')

class Server {
  constructor (config, app) {
    this.config = config
    this.app = app

    this.server = express()

    if (config.cors) {
      this.server.use(cors(config.cors))
    }
    this.server.use(this.logger)

    this.server.use(bodyParser.json({ limit: '80mb' }))

    // this.server.use('/login/', controller.login(this.app))

    this.server.use('/api/', this.sessionMiddleware.bind(this))
    this.server.use('/api/session', controller.session(this.app))

    this.server.use(this.errorHandling)
    this.server.use(express.static('public'))
  }

  async sessionMiddleware (req, res, next) {
    const apiKey = req.get('Authorization')
    try {
      req.session = new Session(this.app)
      if (apiKey) {
        await req.session.getSessionFromApiKey(apiKey)
      } else {
        throw new Error('You need to login before accessing this information')
      }
      next()
    } catch (err) {
      console.error(err.message)
      res.status = (401)
      res.json({ error: err.message })
    }
  }

  logger (req, res, next) {
    console.info('[Server]', req.method, req.originalUrl, 'from', req.ip)
    next()
  }

  errorHandling (err, req, res, next) {
    if (!err.status) {
      err.status = 400
    }
    res.status(err.status)
    res.json({error: err.message})
    console.error(err.stack)
  }

  async run () {
    this.server.listen(this.config.port, this.config.host, () => {
      console.info('[Server]', `Running on ${this.config.host}:${this.config.port}`)
    })
  }
}

module.exports = Server
