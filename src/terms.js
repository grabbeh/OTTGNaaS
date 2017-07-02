const superagent = require('superagent')
const unfluff = require('unfluff')
const url = 'https://www.google.com/policies/privacy/'

const start = async function () {
  let res = await superagent.get(url)
  let data = unfluff(res.text)
  let arr = data.text.split('.')
  console.log(arr.length)
}

start()
