import React from 'react'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: 'Hello World'
    }
  }

  componentDidMount () {}
  render () {
    return (
      <div className='App'>
        {this.state.content}
      </div>
    )
  }
}

export default App
