process.on('unhandledRejection', function (reason, promise) {
  console.log(promise)
})

const express = require('express')
const json = require('express-json')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(json())
app.use(express.static('public'))

const path = require('path')
const getSpeechBubbles = require('./speech')
const getTerms = require('./terms')
const getImageFromSearch = require('./imageFromSearch')
const getImageFromURL = require('./imageFromURL')
const match = require('./match')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/getImage', async (req, res) => {
  const imageData = {
    url: 'public/novel.jpg',
    clientUrl: 'novel.jpg',
    width: 690,
    height: 984
  } /*
  const imageData = {
    url: 'http://s3.amazonaws.com/uploads.kidzworld.com/article/32607/Sphinx_p7.jpg?1251315069',
    clientUrl: 'http://s3.amazonaws.com/uploads.kidzworld.com/article/32607/Sphinx_p7.jpg?1251315069',
    width: 715,
    height: 894
  } */
  // const imageData = await getImageFromSearch()
  const data = await getSpeechBubbles(imageData)
  const url = 'https://www.google.com/policies/privacy/'
  const terms = await getTerms(url, data.length, true)
  const o = {}
  o.imageData = imageData
  o.data = match(data, terms)
  res.json(o)
})

app.post('/postUrl', async (req, res) => {
  const imageData = await getImageFromURL(req.body.url)
  const data = await getSpeechBubbles(imageData)
  const url = 'https://www.google.com/policies/privacy/'
  const terms = await getTerms(url, data.length, true)
  const o = {}
  o.imageData = imageData
  o.data = match(data, terms)
  res.json(o)
})

app.listen(2000)
