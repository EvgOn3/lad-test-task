const { makePdf } = require('./controller')

const makePdfRoute = {
  route: {
    method: 'POST',
    path: '/makePdf',
    handler: makePdf,
  },
  options: {
    validate: {
      payload: async (value, options) => {
        if (!(value instanceof Array)) throw Error()
      },
    },
  },
}

module.exports = []
