const Tesseract = require('tesseract')
const request = require('request')
const fs = require('fs')
const url = 'http://tesseract.projectnaptha.com/img/eng_bw.png'
const fileName = 'pic.png'
const writeFile = fs.createWriteStream(filename)
 
module.exports = async function(url) =>{
  request(url).pipe(writeFile).on('close', function() {
    let results = Tesseract.recognize(fileName)
    console.log(results)  
  })
}






