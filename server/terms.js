const superagent = require('superagent')
const unfluff = require('unfluff')

module.exports = async function (url, len, bool) {
  let result = await superagent.get(url)
  let cleaned = unfluff(result.text)
  let arr = cleaned.text.split('.')
  let noEmptiesArray = arr.filter(a => {
    return a.length > 5
  })
  let cleanArr = noEmptiesArray.map(a => {
    return a.replace(/(\r\n|\n|\r)/gm, '')
  })
  if (len && bool) return shortSlice(cleanArr, len)
  else if (len && !bool) return slice(cleanArr, len)
  else return cleanArr
}

const slice = (arr, x) => {
  var potentialStartPoints = arr.length - x + 1
  var randomStartPoint = Math.floor(potentialStartPoints * Math.random())
  return arr.slice(randomStartPoint, randomStartPoint + x)
}

const shortSlice = (arr, x) => {
  arr.sort(function (a, b) {
    return a.length - b.length
  })
  return arr.splice(0, x)
}
