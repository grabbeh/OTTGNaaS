import React from 'react'
import CanvasContainer from './CanvasContainer'

class App extends React.Component {
  render () {
    return <CanvasContainer url={'/data'} />
  }
}

export default App
