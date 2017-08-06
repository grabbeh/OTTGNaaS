import React from 'react'
import axios from 'axios'
import CanvasComponent from './CanvasComponent'

class CanvasContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: false,
      url: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.postUrl = this.postUrl.bind(this)
    this.getCanvas = this.getCanvas.bind(this)
  }

  getCanvas (i) {
    this.setState({ image: false })
    const url = i || '/getImage'
    axios
      .get(url)
      .then(d => {
        this.setState({ image: d.data })
      })
      .catch(e => {
        console.log(e)
      })
  }

  handleChange (event) {
    this.setState({ url: event.target.value })
  }

  postUrl () {
    this.setState({ image: false })
    console.log('Fn triggered')
    axios
      .post('/postUrl', { url: this.state.url })
      .then(d => {
        console.log('Return fn triggered')
        console.log(d)
        this.setState({ image: d.data })
      })
      .catch(e => {
        console.log(e)
      })
  }

  componentDidMount () {
    // this.getCanvas(this.props.url)
  }

  render () {
    const { image } = this.state
    return image
      ? <div>
        <CanvasComponent image={image} />
        <div><button onClick={() => this.getCanvas()}>Click me!</button></div>

      </div>
      : <div>
        <form onSubmit={this.postUrl}>
          <label>
              URL:
              <input
                type='text'
                value={this.state.url}
                onChange={this.handleChange}
              />
          </label>
          <input type='submit' value='Submit' />
        </form>
      </div>
  }
}

export default CanvasContainer
