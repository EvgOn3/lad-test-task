import { makePdf } from './controller'
import Hapi from '@hapi/hapi'

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  })

  server.route({
    method: 'POST',
    path: '/makepdf',
    handler: (request, h) => {
      //Принимает массив вида:
      // [
      //   "https://yandex.ru/",
      //   "https://www.twitch.tv/",
      //   "https://3dnews.ru/"
      // ]
      return makePdf(request.payload as Array<string>)
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
