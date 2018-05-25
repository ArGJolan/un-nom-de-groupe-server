const express = require('express')

const accountRouter = (app) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    req.session.getAccount().then(data => {
      res.json(data)
    }).catch(next)
  })

  return router
}

module.exports = accountRouter
