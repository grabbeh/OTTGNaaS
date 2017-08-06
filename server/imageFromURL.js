const url = require('url')
const http = require('http')
const sizeOf = require('image-size')

module.exports = async imgUrl => {
  return new Promise((resolve, reject) => {
    const options = url.parse(imgUrl)
    http.get(options, response => {
      const chunks = []
      response
        .on('data', chunk => {
          chunks.push(chunk)
        })
        .on('end', function () {
          let buffer = Buffer.concat(chunks)
          const r = sizeOf(buffer)
          const url = imgUrl
          const width = r.width
          const height = r.height
          let o = { url, width, height }
          resolve(o)
        })
    })
  })
}
