const fs = require('fs')
const axios = require('axios').default
const validUrl = require('valid-url')
const { JSDOM } = require('jsdom')
const { getWordsWithCount, walkOnNodes } = require('./functions')

const makePdf = async function (urls) {
  const uniUrls = new Set(urls)
  try {
    let promises = []

    uniUrls.forEach((url) => {
      if (!validUrl.isUri(url)) return
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            if (url === urls[1]) throw Error()
            const body = (await axios.get(url)).data
            const dom = new JSDOM(body)
            let site = dom.window.document.body
            let nodesContent = walkOnNodes(site)
            const words = getWordsWithCount(nodesContent)
            resolve({ url, words })
          } catch (e) {
            reject(e)
          }
        })
      )
    })

    const wordsResult = (await Promise.allSettled(promises))
      .filter((promise) => {
        return promise.status === 'fulfilled'
      })
      .map((promise) => {
        return promise.value
      })
    console.log(wordsResult)
    return 'Hello World!'
  } catch (e) {
    console.log(e)
  }
}

module.exports = { makePdf }
