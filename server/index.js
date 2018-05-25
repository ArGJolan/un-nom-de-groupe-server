const express = require('express')
// const authRoute = require('./auth')
const bodyParser = require('body-parser')
const controller = require('./controller/')
const cors = require('cors')
const Session = require('./session')

// TEST: POST Login
// TEST: POST Register
// TODO: GET Profil
// TODO: POST Approve
// TODO: GET Profiles (admin)
// TODO: DELETE Profile (admin)
// TODO: POST Profil
// TODO: GET Event
// TODO: POST Event
// TODO: PUT Event (admin)

function logger (req, res, next) {
  console.info('[Server]', req.method, req.originalUrl, 'from', req.ip)
  next()
}

class Server {
  constructor (config, app) {
    this.config = config
    this.app = app

    this.server = express()

    if (config.cors) {
      this.server.use(cors(config.cors))
    }
    this.server.use(logger)

    this.server.use(bodyParser.json({ limit: '80mb' }))

    this.server.use('/login/', controller.login(this.app))
    this.server.use('/register/', controller.register(this.app))

    this.server.use('/api/', this.sessionMiddleware.bind(this))
    this.server.use('/api/session', controller.session(this.app))
    this.server.use('/api/account', controller.account(this.app))

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

  errorHandling (err, req, res, next) {
    let { status } = err
    if (this.error) {
      console.log(this.error)
    }
    if (!err.status) {
      status = 400
    }
    if (err.status >= 500) {
      // save err into db
      res.status(500)
      res.json({ error: 'Internal server error' })
      return
    }
    res.status(status)
    res.json({ error: err.message })
    console.error(err.stack)
  }

  async run () {
    this.server.listen(this.config.port, this.config.host, () => {
      console.info('[Server]', `Running on ${this.config.host}:${this.config.port}`)
    })
  }
}

module.exports = Server
