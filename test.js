const fabric = require('fabric').fabric
const canvas = fabric.createCanvasForNode(1000, 1000, {})
const fs = require('fs')
const path = require('path')
const out = fs.createWriteStream(path.join(__dirname, '/hellome.png'))
let stream = canvas.createPNGStream()
stream.on('data', function (chunk) {
  out.write(chunk)
})

fabric.Image.fromURL('./public/novel.jpg', function (oImg) {
  canvas.add(oImg)
  console.log('Img loaded')
})
