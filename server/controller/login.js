const express = require('express')

const loginRouter = (app) => {
  const router = express.Router()

  router.post('/', (req, res, next) => {
    req.session.login(req.body.email, req.body.password).then(data => {
      res.json(data)
    }).catch(next)
  })

  return router
}

module.exports = loginRouter
