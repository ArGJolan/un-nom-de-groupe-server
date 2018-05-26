const config = require('./config')

const app = {
  async sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

async function runModules (modules) {
  modules.forEach((moduleName) => {
    const ComponentClass = require(`./${moduleName}`)
    app[moduleName] = new ComponentClass(config[moduleName] || {}, app)
  })

  for (let index = 0; index < modules.length; index++) { // ++ can disable
    await app[modules[index]].run() // can disable eslint
  }
}

runModules(['mongo', 'server', 'tasks']).catch(err => {
  console.error('[run-error]', err)
  process.exit(1)
})
