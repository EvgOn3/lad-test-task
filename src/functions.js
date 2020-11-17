const getWordsWithCount = (nodesContent) => {
  let words = []
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

const walkOnNodes = (node) => {
  let nodesContent = []
  const reDom = (node) => {
    if (node.children.length > 0) {
      for (let index = 0; index < node.children.length; index++) {
        reDom(node.children[index])
      }
    } else {
      nodesContent.push(node.textContent)
    }
  }
  reDom(node)
  return nodesContent
}

module.exports = { getWordsWithCount, walkOnNodes }
