const { makePdf } = require('./controller')
const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  })

  server.route({
    method: 'POST',
    path: '/makePdf',
    handler: (request, h) => {
      return makePdf(request.payload)
    },
    options: {
      validate: {
        payload: async (value, options) => {
          if (!(value instanceof Array)) throw Error()
        },
      },
    },
  })
  try {
    await server.start()
    console.log('Server running on %s', server.info.uri)
  } catch (e) {
    console.log(e)
  }
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
