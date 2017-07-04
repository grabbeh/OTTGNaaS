// Imports the Google Cloud client library

const path = require('path')

const vision = require('@google-cloud/vision')({
  projectId: 'avid-water-130111',
  keyFilename: path.join(__dirname, '../config/key.json')
})

module.exports = async function detectText (url) {
  let results = await vision.readDocument(url)
  return results[1].responses[0].textAnnotations
}
