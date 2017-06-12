var req = new XMLHttpRequest()
req.addEventListener('load', reqListener)
req.open('GET', '/data')
req.send()

function reqListener () {
  let clean = JSON.parse(this.responseText)
  displayPolys(clean, true)
}

window.onload = function () {}

function displayPolys (arr, bool) {
  const canvas = document.createElement('canvas')
  canvas.id = 'target'
  canvas.width = 1000
  canvas.height = 1000
  const target = document.getElementById('container')
  target.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (bool) {
    for (const box of arr) {
      drawBox(ctx, box)
    }
  } else {
    drawBox(ctx, arr)
  }
}

function drawBox (context, box) {
  context.beginPath()
  context.moveTo(box[0].x, box[0].y)
  context.lineTo(box[1].x, box[1].y)
  context.lineTo(box[2].x, box[2].y)
  context.lineTo(box[3].x, box[3].y)
  context.lineTo(box[0].x, box[0].y)
  context.fillStyle = 'white'
  context.fill()
}
