const express = require('express')
const app = express()
const path = require('path')
const getSpeech = require('./speech')
const getTerms = require('./terms')
const getUrl = require('./image')
const helper = require('./helper')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/data', async (req, res) => {
  let imageData = {
    url: 'public/novel.jpg',
    clientUrl: 'novel.jpg',
    width: 690,
    height: 984
  }
  // let imageData = await getUrl()
  let data = await getSpeech(imageData)
  let terms = await getTerms(data.length)
  let combinedData = data.map((d, i) => {
    return {
      coordinates: d,
      terms: terms[i],
      width: helper.getWidth(d),
      topLeft: helper.getTopLeft(d)
    }
  })
  let o = {}
  o.imageData = imageData
  o.data = combinedData
  res.json(o)
})

app.listen(2000)
