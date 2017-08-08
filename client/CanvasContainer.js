import React from 'react'
import axios from 'axios'
import CanvasComponent from './CanvasComponent'
import { Box, Label, Button, ButtonOutline, Input } from 'rebass'

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

  postUrl (e) {
    e.preventDefault()
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
      ? <Box>
        <div>
          <CanvasComponent image={image} />
          <div>
            <Button onClick={() => this.getCanvas()}>Click me!</Button>
          </div>
        </div>
      </Box>
      : <Box>
        <form onSubmit={this.postUrl}>
          <Label p={2}>URL:</Label>
          <Input
            w={1 / 2}
            type='text'
            value={this.state.url}
            onChange={this.handleChange}
            />
          <ButtonOutline type='submit' children='Submit' />
        </form>
      </Box>
  }
}

export default CanvasContainer
