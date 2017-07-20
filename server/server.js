process.on('unhandledRejection', function (reason, promise) {
  console.log(promise)
})

const express = require('express')
const app = express()
const path = require('path')
const getSpeech = require('./speech')
const getTerms = require('./terms')
// const getImage = require('./image')
const match = require('./match')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/data', async (req, res) => {
  let baseImageData = {
    url: 'public/novel.jpg',
    clientUrl: 'novel.jpg',
    width: 690,
    height: 984
  }
  let imageData = {
    url: 'http://s3.amazonaws.com/uploads.kidzworld.com/article/32607/Sphinx_p7.jpg?1251315069',
    clientUrl: 'http://s3.amazonaws.com/uploads.kidzworld.com/article/32607/Sphinx_p7.jpg?1251315069',
    width: 715,
    height: 894
  }
  // let imageData = await getImage()
  let data = await getSpeech(baseImageData)
  let url = 'https://www.google.com/policies/privacy/'
  let terms = await getTerms(url, data.length, true)
  let o = {}
  o.imageData = baseImageData
  o.data = match(data, terms)
  res.json(o)
})

app.listen(2000)
