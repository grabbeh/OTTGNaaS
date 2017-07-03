const superagent = require('superagent')
const unfluff = require('unfluff')
const url = 'https://www.google.com/policies/privacy/'

module.exports = async function (x) {
  let res = await superagent.get(url)
  let data = unfluff(res.text)
  let arr = data.text.split('.')
  return returnSlice(x, arr)
}

const returnSlice = (x, arr) => {
  var potentialStartPoints = arr.length - x + 1
  var randomStartPoint = Math.floor(potentialStartPoints * Math.random())
  return arr.slice(randomStartPoint, randomStartPoint + x)
}
