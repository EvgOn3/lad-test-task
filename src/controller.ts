import { UrlWordsWithCountDictionary } from './types'
import fs from 'fs'
import axios from 'axios'
import validUrl from 'valid-url'
import { JSDOM } from 'jsdom'
import { getWordsWithCount, walkOnNodes } from './functions'
import pdfGenerator from 'pdfjs'

export const makePdf = async function (urls: Array<string>) {
  if (!(urls instanceof Array)) throw Error('Incorrect value type')
  const uniUrls = new Set(urls)
  try {
    let promises: Array<Promise<UrlWordsWithCountDictionary>> = []
    uniUrls.forEach((url) => {
      if (!validUrl.isUri(url)) return
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
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
      .map((promise) => {
        if (promise.status === 'fulfilled') return promise.value
      })
      .filter((promise) => promise)

    console.log(wordsResult)
    var pdf = new pdfGenerator.Document()
    return pdf
  } catch (e) {
    console.log(e)
  }
}
