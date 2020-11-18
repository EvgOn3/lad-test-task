export interface WordsWithCount {
  value: string
  count: number
}

export interface UrlWordsWithCountDictionary {
  url: string
  words: Array<WordsWithCount>
}
