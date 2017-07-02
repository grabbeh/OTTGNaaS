const express = require('express')
const app = express()
const path = require('path')
const getSpeech = require('./speech')

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/data', async function (req, res) {
  let data = await getSpeech('public/novel.jpg')
  res.json(data)
})

app.listen(2000)
