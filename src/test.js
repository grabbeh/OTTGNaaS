const tess = require('./tesseract')

const test = async () => {
  const url = ""
  let results = await tess(url)
  console.log(results)
}

test()
