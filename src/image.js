const GoogleImages = require('google-images')
const k = require('../config/image')
const client = new GoogleImages(k.cse_key, k.api_key)

module.exports = async function () {
  let results = await client.search('graphic novel page', { page: 10 })
  let images = results.map(r => {
    return {
      url: r.url,
      width: r.width,
      height: r.height
    }
  })
  let image = images[Math.floor(Math.random() * images.length)]
  console.log(image)
  return image
}
