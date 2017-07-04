const kmeans = require('node-kmeans')
const _ require('underscore')
const helper = require('./helper')

exports.matchTextLengthToArea = (speech, terms) => {
   let textAreas = terms.map(t => {
      let textBox = new fabric.Textbox(text, {
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
       area: helper.getArea(area), 
       coordinates: s,
       width: helper.getWidth(d),
       topLeft: helper.getTopLeft(d)
     }
   })
   return combine(speechAreas, textAreas)
}

const combine = (s, t) => { 
   t.sort(function(a, b) { return a.area - b.area })
   s.sort(function(a, b) { return a.area - b.area })
   s.forEach(speech, i => { speech.text = textAreas[i] })
   return s
}

/*
let arr = []
arr.push(textAreas)
arr.push(speechAreas)
let flat = _.flatten(arr, true)
let vectors = flat.map(f => {
   return [f.area]
})*/
 
//let clusterResult = cluster(vectors)
//let matchResult = matchBack(speechAreas, textAreas, clusterResult)
   
const matchBack = (speechAreas, textAreas, clusterResult) => {
  let arr = []
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
          }
      })
    })
  })
  return clusterResult
}

const cluster = (vectors) => {
  kmeans.clusterize(vectors, {k: speech.length }, (err,res) => {
    if (err) console.error(err)
    else return res
  })
}
