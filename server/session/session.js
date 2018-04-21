const crypto = require('crypto')

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

  async createNewAccount (email, password) { // Returns account
    await this.app.mongo.insertOne('account', { email, password, rights: [] })
    return this.app.mongo.getOne('account', { email })
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
