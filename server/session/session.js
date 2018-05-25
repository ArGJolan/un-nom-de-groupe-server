const crypto = require('crypto')
const bcrypt = require('bcryptjs')

function hashPassword (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(new Error(`Mot de passe : ${err.message}`))
      } else {
        resolve(hash)
      }
    })
  })
}

class SessionService {
  constructor (app, apiKey) {
    this.app = app
    this.apiKey = null
    this.account = null
    this.session = null
  }

  async generateApiKey () {
    this.apiKey = new Promise((resolve, reject) => {
      crypto.randomBytes(30, (err, buf) => {
        if (err) {
          reject(err)
        } else {
          resolve(buf.toString('hex'))
        }
      })
    })
    return this.apiKey
  }

  async approveAccount (email) {
    if (this.hasRight('admin')) {
      try {
        await this.app.mongo.updateOne('account', { email }, { $set: { approved: true } })
      } catch (err) {
        console.error('Could not approve account', err)
        throw new Error('Could not appove account')
      }
    } else {
      throw new Error('You don\'t have the permission to do that')
    }
  }

  async createNewAccount (email, password) { // Returns account
    const account = {
      approved: false,
      email,
      password: await hashPassword(password),
      rights: []
    }
    await this.app.mongo.insertOne('account', account)
    return this.app.mongo.getOne('account', { email })
  }

  async login (email, password) {
    let account
    try {
      account = await this.app.mongo.getOne('account', { email, password: await hashPassword(password) })
    } catch (err) {
      console.error(err)
      throw new Error('Could not connect')
    }
    if (account.approved !== true) {
      throw new Error('Your account has not been activated yet')
    }
    delete account.password
    return { ...account, apiKey: await this.generateApiKey() }
  }

  async getSessionFromApiKey (apiKey) { // Returns full info
    this.apiKey = apiKey || this.apiKey
    try {
      this.session = await this.app.mongo.getOne('session', { apiKey: this.apiKey })
      this.account = await this.app.mongo.getOne('account', { email: this.session.email })
      return this.session
    } catch (err) {
      throw new Error('Your session has expired')
    }
  }
}

module.exports = SessionService
