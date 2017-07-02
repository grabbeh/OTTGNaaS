const domready = require('domready')
const request = require('browser-request')
const fabric = require('fabric').fabric

domready(() => {
  request({ method: 'GET', url: '/data', json: true }, (err, res) => {
    if (err) console.log(err)
    const canvas = new fabric.Canvas('c', { height: 984, width: 690 })
    canvas.setBackgroundImage('novel.jpg', canvas.renderAll.bind(canvas), {})
    res.body.forEach(function (c, i) {
      renderBox(c, i, canvas)
    })
  })
})

function renderBox (arr, text, canvas) {
  let poly = new fabric.Polygon(arr, {
    stroke: 'white',
    strokeWidth: 1,
    fill: 'white'
  })
  let t = new fabric.Text(text.toString(), {
    left: arr[0].x,
    top: arr[0].y,
    stroke: 'black',
    fontFamily: 'Komikax',
    fontSize: 10
  })
  canvas.add(poly)
  canvas.add(t)
}
