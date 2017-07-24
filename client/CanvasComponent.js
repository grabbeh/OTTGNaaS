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

class CanvasComponent extends React.Component {
  componentDidMount () {
    const result = this.props.image
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
  }

  render () {
    return (
      <div>
        <canvas id='c' />
      </div>
    )
  }
}

export default CanvasComponent
