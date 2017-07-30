import React from 'react'
import f from 'fabric'
const fabric = f.fabric

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

function CanvasComponent ({ image }) {
  const { height, width, clientUrl } = image.imageData
  const canvas = new fabric.Canvas('c', { height, width })

  canvas.setBackgroundImage(clientUrl, canvas.renderAll.bind(canvas), {})
  image.data.forEach(function (c, i) {
    renderBox(c.coordinates, c.terms, c.width, c.topLeft, canvas)
  })
  return (
    <div>
      <canvas id='c' />
    </div>
  )
}

export default CanvasComponent
