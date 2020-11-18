import { makePdfAsync } from './controller'
import Hapi from '@hapi/hapi'
import fs from 'fs'

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  })

  server.route({
    method: 'POST',
    path: '/makepdf',
    handler: async (request, h) => {
      //Принимает массив вида:
      // [
      //   "https://yandex.ru/",
      //   "https://3dnews.ru/"
      // ]
      try {
        const pdfBufferResult = await makePdfAsync(
          request.payload as Array<string>
        )
        return h.response(pdfBufferResult).type('application/pdf')
      } catch (e) {
        console.log(e)
      }
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
