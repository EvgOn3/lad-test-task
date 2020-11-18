import { UrlWordsWithCountDictionary } from './types'
import axios from 'axios'
import validUrl from 'valid-url'
import { JSDOM } from 'jsdom'
import { generatePdfResult, getWordsWithCount, walkOnNodes } from './functions'

export const makePdfAsync = async function (urls: Array<string>) {
  if (!(urls instanceof Array)) throw Error('Incorrect value type')
  const uniUrls = new Set(urls)

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

  const promisesResult = await Promise.allSettled(promises)

  let urlsResult: Array<UrlWordsWithCountDictionary> = []

  promisesResult.forEach((promise) => {
    if (promise.status === 'fulfilled') urlsResult.push(promise.value)
  })

  return await generatePdfResult(urlsResult)
}
