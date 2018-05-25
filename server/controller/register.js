const express = require('express')

const registerRouter = (app) => {
  const router = express.Router()

  router.post('/', (req, res, next) => {
    req.session.createNewAccount(req.body.email, req.body.password).then(data => {
      res.json(data)
    }).catch(next)
  })

  return router
}

module.exports = registerRouter
