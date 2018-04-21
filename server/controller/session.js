const express = require('express')

const sessionRouter = (app) => {
  const router = express.Router()

  router.post('/', (req, res, next) => {
    req.session.getFullInfo().then(data => {
      res.json(data)
    }).catch(next)
  })

  return router
}

module.exports = sessionRouter
