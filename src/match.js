const kmeans = require('node-kmeans')
// const _ = require('underscore')
const helper = require('./helper')
const fabric = require('fabric').fabric

module.exports = (speech, terms) => {
  let textAreas = terms.map(t => {
    let textBox = new fabric.Textbox(t, {
      fontSize: 5
    })
    let height = textBox.getBoundingRectHeight()
    let width = textBox.getBoundingRectWidth()
    let textArea = height * width
    return {
      text: t,
      area: textArea
    }
  })

  let speechAreas = speech.map(s => {
    return {
      area: helper.getArea(s),
      coordinates: s,
      width: helper.getWidth(s),
      topLeft: helper.getTopLeft(s)
    }
  })
  return combine(speechAreas, textAreas)
}

const combine = (speech, text) => {
  text.sort(function (a, b) {
    return a.area - b.area
  })
  speech.sort(function (a, b) {
    return a.area - b.area
  })
  speech.forEach(function (s, i) {
    /* console.log(i)
    console.log('Speech bubble area')
    console.log(s.area)
    console.log('Text area')
    console.log(text[i].area) */
    s.terms = text[i].text
  })
  return speech
}

/*
let arr = []
arr.push(textAreas)
arr.push(speechAreas)
let flat = _.flatten(arr, true)
let vectors = flat.map(f => {
   return [f.area]
}) */

// let clusterResult = cluster(vectors)
// let matchResult = matchBack(speechAreas, textAreas, clusterResult)
/*
const matchBack = (speechAreas, textAreas, clusterResult) => {
  speechAreas.forEach(s => {
    textAreas.forEach(t => {
      clusterResult.forEach(c => {
        c.cluster.forEach(cl => {
          if (cl === t.area) {
            c.t = t
          }
          if (cl === s.area) {
            c.s = s
          }
        })
      })
    })
  })
  return clusterResult
}

const cluster = vectors => {
  kmeans.clusterize(vectors, { k: speech.length }, (err, res) => {
    if (err) console.error(err)
    else return res
  })
}
*/
