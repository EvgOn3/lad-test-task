import { WordsWithCount } from './types'

export const getWordsWithCount = (nodesContent: Array<string>) => {
  let words: Array<WordsWithCount> = []
  nodesContent.forEach((content) => {
    const tokens = content.split(' ')
    tokens.forEach((token) => {
      if (token.length > 4 && token.match(/^[a-zA-Zа-яА-ЯёЁ]*$/)) {
        const foundToken = words.find((f) => f.value === token)
        if (foundToken) foundToken.count++
        else words.push({ value: token, count: 0 })
      }
    })
  })

  return words
}

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
