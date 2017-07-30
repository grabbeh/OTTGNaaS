import React from 'react'
import axios from 'axios'
import CanvasComponent from './CanvasComponent'

class CanvasContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { image: false }
  }

  componentDidMount () {
    const { url } = this.props
    axios
      .get(url)
      .then(d => {
        this.setState({ image: d.data })
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    const { image } = this.state
    return image ? <CanvasComponent image={image} /> : <div>Loading</div>
  }
}

export default CanvasContainer
