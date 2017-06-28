const fabric = require('fabric').fabric
const canvas = fabric.createCanvasForNode(1000, 1000, {})
var Canvas = require('canvas')
const fs = require('fs')
const path = require('path')
const http = require('http')
const out = fs.createWriteStream(path.join(__dirname, '/output/hellome.png'))
/*
fabric.Image.fromURL('./public/novel.jpg', function (img) {
  canvas.add(img)
  console.log('Img loaded')
  let stream = canvas.createPNGStream()
  stream.on('data', function (chunk) {
    out.write(chunk)
    console.log('writing to file...')
  })
})
/*
canvas.setBackgroundImage('./public/novel.jpg', function (img) {
  let stream = canvas.createPNGStream()
  stream.on('data', function (chunk) {
    out.write(chunk)
    console.log('writing to file...')
  })
})

fabric.Image.fromURL('./public/novel.jpg', function (myImg) {
  var stream = canvas.createPNGStream()

  canvas.setBackgroundImage(myImg, canvas.renderAll.bind(canvas))

  stream.on('data', function (chunk) {
    out.write(chunk)
  })

  stream.on('end', function (data) {
    console.log('Img done')
  })
}) */

let stream = canvas.createPNGStream()
stream.on('data', function (chunk) {
  out.write(chunk)
  console.log('writing to file...')
})

fs.readFile(__dirname + '/images/squid.png', function (err, squid) {
  if (err) throw err
  img = new Image()
  img.src = squid
  ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4)
})
