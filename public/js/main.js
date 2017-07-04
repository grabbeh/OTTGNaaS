const domready = require('domready')
const request = require('browser-request')
const fabric = require('fabric').fabric

domready(() => {
  request({ method: 'GET', url: '/data', json: true }, (err, res) => {
    if (err) console.log(err)
    let result = res.body
    const canvas = new fabric.Canvas('c', {
      height: result.imageData.height,
      width: result.imageData.width
    })
    canvas.setBackgroundImage(
      result.imageData.clientUrl,
      canvas.renderAll.bind(canvas),
      {}
    )
    result.data.forEach(function (c, i) {
      renderBox(c.coordinates, c.terms, c.width, c.topLeft, canvas)
    })
  })
})

function renderBox (arr, text, width, topLeft, canvas) {
  let poly = new fabric.Polygon(arr, {
    stroke: 'white',
    strokeWidth: 1,
    fill: 'white'
  })
  let t = new fabric.Textbox(text, {
    left: topLeft.x + 5,
    top: topLeft.y + 5,
    stroke: 'black',
    fontFamily: 'Komikax',
    fontSize: 7,
    width: width - 10
  })
  canvas.add(poly)
  canvas.add(t)
}
