const path = require('path')

class Tasks {
  constructor (config, app) {
    this.app = app
    this.tasks = config.tasks || []
    console.log(this.tasks)
  }

  async run () {
    for (let index = 0; index < this.tasks.length; index++) {
      await this.runTask(this.tasks[index])
    }
  }

  async runTask (taskName) {
    try {
      return require(path.join(process.cwd(), 'tasks', `${taskName}.task`))(this.app)
    } catch (err) {
      console.error(`[tasks.${taskName}] error:`, err)
      throw err
    }
  }
}

module.exports = Tasks
