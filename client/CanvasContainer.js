import React from 'react'
import axios from 'axios'
import CanvasComponent from './CanvasComponent'

class CanvasContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { image: false }
  }

  componentDidMount () {
    axios
      .get(this.props.url)
      .then(d => {
        this.setState({ image: d.data })
      })
      .catch(e => {
        console.log(e)
      })
  }

  render () {
    if (!this.state.image) return <div>Loading</div>
    if (this.state.image) return <CanvasComponent image={this.state.image} />
  }
}

export default CanvasContainer
