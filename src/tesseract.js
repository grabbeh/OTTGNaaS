const superagent = require('superagent')
const Tesseract = require('tesseract')

module.exports = async function(url) =>{
  let image = await superagent(url)
  let result = await Tesseract.recognize(image)
  console.log(result)
}

