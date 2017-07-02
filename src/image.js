const GoogleImages = require('google-images')
const k = require('../config/image')
const client = new GoogleImages(k.cse_key, k.api_key)

client
  .search('graphic novel page', { page: 10 })
  .then(images => {
    images.forEach(i => {
      console.log(i.url)
    })
  })
  .catch(err => {
    console.log(err)
  })
