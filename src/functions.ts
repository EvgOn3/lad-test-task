import fs from 'fs'
import path from 'path'
import pdfGenerator from 'pdfjs'
import {
  UrlParseResult,
  UrlWordsWithCountDictionary,
  WordsWithCount,
} from './types'

//Загружаем шрифты 1 раз при запуске приложения
const fontPath = path.resolve(__dirname, 'open-sans.ttf')
const fontFile = fs.readFileSync(fontPath)

/**
 * Возвращает массив объектов WordsWithCount
 * Объект состоит из слова и счетчика
 */
export const getWordsWithCount = (nodesContent: Array<string>) => {
  let words: Array<WordsWithCount> = []
  nodesContent.forEach((content) => {
    const tokens = content.split(' ')
    tokens.forEach((token) => {
      if (token.length > 4 && token.match(/^[а-яА-ЯёЁ]*$/)) {
        const foundToken = words.find((f) => f.value === token)
        if (foundToken) foundToken.count++
        else words.push({ value: token, count: 0 })
      }
    })
  })

  return words
}

/**
 * Рекурсивно проходим по всему DOM
 * и собираем textContent каждой ноды
 */
export const walkOnNodes = (element: Element) => {
  let nodesContent: Array<string> = []
  const reDom = (element: Element) => {
    if (element.children.length > 0) {
      for (let index = 0; index < element.children.length; index++) {
        reDom(element.children[index])
      }
    } else if (element.textContent) {
      nodesContent.push(element.textContent)
    }
  }
  reDom(element)
  return nodesContent
}

/**
 * Генерируем и заполняем pdf
 * и возвращаем в виде буффера
 */
export const generatePdfResult = async (
  urlsResult: Array<UrlWordsWithCountDictionary>
) => {
  let urlsParseResult: Array<UrlParseResult> = []

  urlsResult.forEach((urlResult) => {
    if (urlResult.words.length === 0) return
    urlResult.words.sort((a, b) => b.count - a.count)
    urlsParseResult.push({
      url: urlResult.url,
      words: [
        urlResult.words[0]?.value ?? '',
        urlResult.words[1]?.value ?? '',
        urlResult.words[2]?.value ?? '',
      ],
    })
  })

  const font = new pdfGenerator.Font(fontFile)
  var doc = new pdfGenerator.Document({ font })
  const table = doc.table({
    widths: [190, 120, 120, 120],
    borderWidth: 1,
    padding: 5,
  })

  urlsParseResult.forEach((urlResult) => {
    let tr = table.row()
    tr.cell(urlResult.url, { textAlign: 'center' })
    urlResult.words.forEach((word) => {
      tr.cell(word, { textAlign: 'center' })
    })
  })

  return await doc.asBuffer()
}
