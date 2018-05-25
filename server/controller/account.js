const express = require('express')

const accountRouter = (app) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    req.session.getAccount().then(data => {
      res.json(data)
    }).catch(next)
  })

  router.get('/all', (req, res, next) => {
    req.session.getAccounts().then(data => {
      res.json(data)
    }).catch(next)
  })

  router.post('/approve', (req, res, next) => {
    req.session.approveAccount(req.body.email).then(data => {
      res.json(data)
    }).catch(next)
  })

  router.delete('/', (req, res, next) => {
    req.session.deleteAccount(req.body.email).then(data => {
      res.json(data)
    }).catch(next)
  })

  router.post('/', (req, res, next) => {
    req.session.editAccount(req.body.data).then(data => {
      res.json(data)
    }).catch(next)
  })

  return router
}

module.exports = accountRouter
