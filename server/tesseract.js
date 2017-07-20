const tesseract = require('tesseract.js')
const request = require('request')
const fs = require('fs')
const url = 'http://tesseract.projectnaptha.com/img/eng_bw.png'
const fileName = 'pic.png'
const path = require('path')
const writeFile = fs.createWriteStream(fileName)

const tessUrl = url => {
  request(url).pipe(writeFile).on('close', function () {
    tesseract.process(fileName, function (err, text) {
      if (err) console.error(err)
      else console.log(text)
    })
  })
}

module.exports = async function (url) {
  let result = await tesseract.recognize(url)
  console.log(result)
  let bboxes = result.text.map(r => {
    return r.bbox
  })
  let transformedBboxes = bboxes.map(b => {
    let xShift = b.x1 - b.x0
    let yShift = b.y1 - b.y0
    return [
      { x: b.x0, y: b.y0 },
      { x: b.x0 + xShift, y: b.y0 },
      { x: b.x1, y: b.y1 },
      { x: b.x0, y: b.y0 + yShift }
    ]
  })
  return transformedBboxes
}
/*
const tess = async function (url) {
  let result = await tesseract.recognize(url)
  fs.writeFileSync('result.json', result, function (err, res) {
    console.log('File saved')
  })
} */

// tess('../public/novel.jpg')
