const express = require('express')
const app = express()
const path = require('path')
const _ = require('underscore')
const __ = require('lodash')
const fabric = require('fabric').fabric
const Jimp = require('jimp')
const data = require('./public/results.json')
const annotations = data.textAnnotations
const polys = annotations.map(a => {
  return {
    coords: a.boundingPoly.vertices,
    area: null,
    id: null,
    bucketId: null
  }
})
const fs = require('fs')
const out = fs.createWriteStream(__dirname + '/helloworld.png')

/*
Jimp.read('./public/novel.jpg')
  .then(function (jpg) {
    const w = jpg.bitmap.width
    const h = jpg.bitmap.height
    const canvas = fabric.createCanvasForNode(w, h)
  })
  .catch(function (err) {
    console.error(err)
  })
*/

let clean = cleanPolys(polys)
let high = getHighestCoords(clean)
let coordsOfHighest = createCoords(high)
let largestArea = calculateArea(coordsOfHighest)
let areas = addArea(clean)
let filteredBoxes = areas.filter(a => {
  let acceptableArea = largestArea / 1
  return a.area < acceptableArea
})
let boxes = _.pluck(filteredBoxes, 'coords')

let enlargedBoxes = filteredBoxes.map(a => {
  a.enlargedCoords = increaseArea(__.cloneDeep(a.coords), 50)
  return a
})

/*
let one = filteredBoxes.slice(0, 1)

one.map(a => {
  console.log(a.coords)
  const clone = __.cloneDeep(a.coords)
  // console.log(increaseArea(a.coords, 20))
  let newArea = increaseArea(clone, 20)
  // console.log(newArea)
  a.newArea = newArea
  console.log(a)
})
*/

// console.log(filteredBoxes[0].coords)
// console.log(enlargedBoxes[0].enlargedCoords)
// console.log(increaseArea(filteredBoxes[0].coords, 20))

const canvas = fabric.createCanvasForNode(1000, 1000, {})

filteredBoxes.forEach(a => {
  let poly = new fabric.Polygon(a.coords, {
    stroke: 'black',
    left: a.coords[0].x,
    top: a.coords[0].y
  })
  canvas.add(poly)
})

enlargedBoxes.forEach(a => {
  let poly = new fabric.Polygon(a.enlargedCoords, {
    stroke: 'white',
    left: a.enlargedCoords[0].x,
    top: a.enlargedCoords[0].y
  })
  canvas.add(poly)
})

var stream = canvas.createPNGStream()
stream.on('data', function (chunk) {
  out.write(chunk)
})

fabric.Image.fromURL('./public/novel.jpg', function (oImg) {
  canvas.add(oImg)
})

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/data', function (req, res) {
  res.send(boxes)
})

app.listen(2000)

function calculateArea (arr) {
  let lowX = null
  let lowY = null
  let highX = null
  let highY = null
  var o = { lowX, lowY, highX, highY }
  lowX = arr[0].x
  lowY = arr[0].y
  for (let coord of arr) {
    if (coord.x > highX) {
      o.highX = coord.x
    }
    if (coord.y > highY) {
      o.highY = coord.y
    }
    if (coord.x < lowX) {
      o.lowx = coord.x
    }
    if (coord.y < lowY) {
      o.lowY = coord.y
    }
  }

  let width = o.highX - o.lowX
  let height = o.highY - o.lowY
  let area = width * height
  return area
}

function cleanPolys (arr) {
  for (let box of arr) {
    for (let coord of box.coords) {
      if (!coord.x) {
        coord.x = 0
      }
      if (!coord.y) {
        coord.y = 0
      }
    }
  }
  return arr
}

function getHighestCoords (arr) {
  let highestX = 0
  let highestY = 0
  var o = { highestX, highestY }
  for (let box of arr) {
    for (let coord of box.coords) {
      if (coord.x > highestX) {
        o.highestX = coord.x
      }
      if (coord.y > highestY) {
        o.highestY = coord.y
      }
    }
  }
  return o
}

function createCoords (o) {
  let arr = []
  arr[0] = { x: 0, y: 0 }
  arr[1] = { x: o.highestX, y: 0 }
  arr[2] = { x: o.highestX, y: o.highestY }
  arr[3] = { x: 0, y: o.highestY }
  return arr
}

function addArea (arr) {
  for (let box of arr) {
    box.area = calculateArea(box.coords)
  }
  return arr
}

function increaseArea (a, increasePercentage) {
  const positiveMultiplier = increasePercentage / 100 + 1
  const negativeMultiplier = 1 - increasePercentage / 100
  a[0].x = a[0].x * negativeMultiplier
  a[0].y = a[0].y * negativeMultiplier
  a[3].x = a[3].x * negativeMultiplier
  a[3].y = a[3].y * negativeMultiplier
  a[1].x = a[3].x * positiveMultiplier
  a[1].y = a[3].y * positiveMultiplier
  a[2].x = a[3].x * positiveMultiplier
  a[2].y = a[3].y * positiveMultiplier
  return a
  /*for (let coord of a) {
    coord.x = coord.x * multiplier
    coord.y = coord.y * multiplier
  }*/
  return a
}

function groupBoxes () {
  let i = 1
  let arr = []
  canvas.forEachObject(function (obj) {
    canvas.forEachObject(function (objTwo) {
      if (obj.intersectsWithObject(objTwo)) {
        console.log('INTERSECTION')
        // If there is intersection and compared object has bucket ID already then give bucketId to new object
        if (objTwo.bucketId) {
          obj.bucketId = objTwo.bucketId
        } else {
          // if no existing bucketID then give new object new ID and increment counter
          obj.bucketId = i
          i++
        }
        arr.push(obj.id)
      } else {
        // if no intersection then give new ID and increment counter as new bucket required
        obj.bucketId = i
        i++
      }
    })
  })
}

groupBoxes()
