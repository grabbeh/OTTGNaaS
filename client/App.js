import React from 'react'
import CanvasContainer from './CanvasContainer'
import { Provider, PanelHeader, Box } from 'rebass'

const App = props => (
  <Provider>
    <Box p={2}>
      <PanelHeader>
        OTTGNaaS
      </PanelHeader>
      <CanvasContainer url={'/getImage'} />
    </Box>
  </Provider>
)

export default App
