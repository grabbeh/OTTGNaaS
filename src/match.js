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
    id: i,
    area: textArea
   }
})

  speech.forEach(s => {
    let area = helper.getArea(a)
    console.log("Area")
    console.log(area)
    terms.forEach(t => {
      console.log("Term string")
      console.log(t.length)
    })
  }
  return arr of objects with [{ coords: [], terms: "" }]

  let combinedData = speech.map((s, i) => {
    return {
      coordinates: s.coords,
      terms: s.terms,
      width: helper.getWidth(d),
      topLeft: helper.getTopLeft(d)
    }
  })


}
