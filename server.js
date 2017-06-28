const express = require('express')
const app = express()
const path = require('path')
const fn = require('./app.js')

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/data', function (req, res) {
  fn.getData(function (err, data) {
    if (err) console.log(err)
    res.json(data)
  })
})

app.listen(2000)
