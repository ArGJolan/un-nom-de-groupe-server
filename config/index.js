const _ = require('lodash')
const generalConfig = require('./config')

let localConfig = {}

try {
  localConfig = require('./config.local')
} catch (e) {
  console.error(e)
}

module.exports = _.merge({}, generalConfig, localConfig)
