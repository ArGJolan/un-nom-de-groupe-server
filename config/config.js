module.exports = {
  server: {
    host: 'localhost',
    port: 1667,
    cors: {
      origin: ['http://127.0.0.1:4343'],
      credentials: true,
      maxAge: 600
    }
  },
  mongo: {
    host: '',
    port: '',
    database: ''
  },
  tasks: {
    tasks: ['accounts']
  }
}
