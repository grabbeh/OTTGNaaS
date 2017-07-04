const express = require('express')
const app = express()
const path = require('path')
const getSpeech = require('./speech')
const getTerms = require('./terms')
const getUrl = require('./image')
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
  // let imageData = await getUrl()
  let data = await getSpeech(imageData)
  let terms = await getTerms(data.length)
  let o = {}
  o.imageData = imageData
  o.data = combine(data, terms)
  res.json(o)
})

app.listen(2000)
