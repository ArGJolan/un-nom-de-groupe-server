const bcrypt = require('bcryptjs')

async function createAccounts (app, parameters) {
  try {
    await app.mongo.getOne('account', { email: 'argjolan@gmail.com' })
  } catch (err) {
    await app.mongo.insert('account', {
      email: 'argjolan@gmail.com',
      password: bcrypt.hashSync('toto42'),
      rights: ['admin'],
      approved: true
    })
  }

  try {
    await app.mongo.getOne('account', { email: 'disabled@gmail.com' })
  } catch (err) {
    await app.mongo.insert('account', {
      email: 'disabled@gmail.com',
      password: bcrypt.hashSync('toto42'),
      rights: [],
      approved: false
    })
  }

  try {
    await app.mongo.getOne('account', { email: 'to-enable@gmail.com' })
  } catch (err) {
    await app.mongo.insert('account', {
      email: 'to-enable@gmail.com',
      password: bcrypt.hashSync('toto42'),
      rights: [],
      approved: false
    })
  }
}

module.exports = createAccounts
