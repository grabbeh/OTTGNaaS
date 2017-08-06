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
    fontSize: 9,
    width: width - 10
  })
  canvas.add(poly)
  canvas.add(t)
}

class CanvasComponent extends React.Component {
  componentDidMount () {
    const image = this.props.image
    let { height, width, url } = image.imageData
    // for testing with static data, url needs to be 'clientUrl'
    if (image.imageData.clientUrl) url = image.imageData.clientUrl
    const canvas = new fabric.Canvas('c', { height, width })
    canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas), {})
    image.data.forEach(function (c, i) {
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
