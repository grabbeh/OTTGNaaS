window.onload = function () {
  var req = new XMLHttpRequest()
  req.addEventListener('load', reqListener)
  req.open('GET', '/data')
  req.send()
  function reqListener () {
    const clean = JSON.parse(this.responseText)
    var canvas = new fabric.Canvas('c', { height: 984, width: 690 })
    canvas.setBackgroundImage('novel.jpg', canvas.renderAll.bind(canvas), {})
    clean.forEach(function (c, i) {
      renderBox(c, i, canvas)
    })
  }
}

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
