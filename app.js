const express = require('express')
const app = express()
const path = require('path')
const _ = require('underscore')
const data = require('./public/results.json')
const annotations = data.textAnnotations
const polys = annotations.map(a => {
  return {
    coords: a.boundingPoly.vertices,
    area: null
  }
})

let clean = cleanPolys(polys)
let high = getHighestCoords(clean)
let coordsOfHighest = createCoords(high)
let largestArea = calculateArea(coordsOfHighest)
let areas = addArea(clean)
let filteredAreas = areas.filter(a => {
  let acceptableArea = largestArea / 1
  return a.area < acceptableArea
})

let coords = _.pluck(filteredAreas, 'coords')
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/data', function (req, res) {
  res.send(coords)
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

function intersect (a, b) {
  return (
    a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom
  )
}

function intersect (a, b) {
  return (
    a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom
  )
}

function enlargeArea(a, increasePercentage){
  const multiplier = (increasePercentage / 100) + 1
  for (let coord of a) {
    coord.x = coord.x * multiplier
  }
  return a
}

