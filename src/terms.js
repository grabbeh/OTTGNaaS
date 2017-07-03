const superagent = require('superagent')
const unfluff = require('unfluff')
const url = 'https://www.google.com/policies/privacy/'

const start = async function (x) {
  let res = await superagent.get(url)
  let data = unfluff(res.text)
  let arr = data.text.split('.')
  return returnSlice(x, arr)
}

start()

function returnSlice(x, arr){
  var potentialStartPoints = arr.length - x
  var randomStartPoint = Math.floor(potentialStartPoints * Math.random())
  return a.slice(randomStartPoint, randomStartPoint + x)
}
