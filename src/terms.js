const superagent = require('superagent')
const unfluff = require('unfluff')

module.exports = async function (url, len) {
  const url = url || 'https://www.google.com/policies/privacy/'
  let result = await superagent.get(url)
  let cleaned = unfluff(res.text)
  let arr = cleaned.text.split('.')
  if (x) returnSlice(x, arr)
  else return arr
}

const returnSlice = (x, arr) => {
  var potentialStartPoints = arr.length - x + 1
  var randomStartPoint = Math.floor(potentialStartPoints * Math.random())
  return arr.slice(randomStartPoint, randomStartPoint + x)
}
