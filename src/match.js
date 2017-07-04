const kmeans = require('node-kmeans')
const _ require('underscore')
const helper = require('./helper')

exports.matchTextLengthToArea = (speech, terms) => {

let textAreas = terms.map(t, i => {
   let textBox = new fabric.Textbox(text, {
          fontSize: 5
   })
   let height = textBox.getBoundingRectHeight()  
   let width = textBox.getBoundingRectWidth()
   let textArea = height * width
   return { 
    text: t,
    textId: i,
    area: textArea
   }
})

let speechAreas = speech.map(s, i => {
  let area = helper.getArea(a)
  s.area = area
  s.speechId = i
  return s
})

let arr = []
arr.push(textAreas)
arr.push(speechAreas)
let flat = _.flatten(arr)
let vectors = flat.map(f => {
   return [f.area]
})

let clusterResult = cluster(vectors)
let matchResult = matchBack(speechAreas, textAreas, clusterResult)

var numbers = [4, 2, 5, 1, 3]
numbers.sort(function(a, b) {
  return a - b
})
   
function matchBack(speechAreas, textAreas, clusterResult){
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
  
  

//return arr of objects with [{ coords: [], terms: "" }]

function cluster(vectors){
  kmeans.clusterize(vectors, {k: speech.length }, (err,res) => {
    if (err) console.error(err)
    else return res
  })
}
   
 let combinedData = fullArr.map((s, i) => {
    return {
      coordinates: s.coords,
      terms: s.terms,
      width: helper.getWidth(s.coords),
      topLeft: helper.getTopLeft(s.coords)
    }
  })
}
