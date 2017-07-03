const domready = require('domready')
const request = require('browser-request')
const fabric = require('fabric').fabric

domready(() => {
  request({ method: 'GET', url: '/data', json: true }, (err, res) => {
    if (err) console.log(err)
    const canvas = new fabric.Canvas('c', { height: 984, width: 690 })
    canvas.setBackgroundImage('novel.jpg', canvas.renderAll.bind(canvas), {})
    res.body.data.forEach(function (c, i) {
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
    top: topLeft.y,
    stroke: 'black',
    fontFamily: 'Komikax',
    fontSize: 5,
    width: width - 10
  })
  canvas.add(poly)
  canvas.add(t)
}
