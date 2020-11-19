import { makePdfAsync } from './controller'
import Hapi from '@hapi/hapi'

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
        return h
          .response(pdfBufferResult)
          .type('application/pdf')
          .encoding('binary')
          .header(
            'Content-Disposition',
            'attachment; filename="pdf_response.pdf"'
          )
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

init()
