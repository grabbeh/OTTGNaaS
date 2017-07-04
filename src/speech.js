const detectText = require('./text')
const helper = require('./helper')
const path = require('path')
const _ = require('underscore')
const __ = require('lodash')
const ch = require('quick-hull-2d')
const fabric = require('fabric').fabric
const fs = require('fs')

module.exports = async imageData => {
  let annotations = await detectText(imageData.url)
  const canvas = fabric.createCanvasForNode(
    imageData.width,
    imageData.height,
    {}
  )
  canvas.setBackgroundColor(
    'rgba(255, 73, 64, 0.6)',
    canvas.renderAll.bind(canvas)
  )
  const polys = annotations.map((a, i) => {
    return {
      coords: a.boundingPoly.vertices,
      area: null,
      id: i,
      groupId: null
    }
  })
  const out = fs.createWriteStream(path.join(__dirname, '../output/poly.png'))
  let stream = canvas.createPNGStream()
  stream.on('data', function (chunk) {
    out.write(chunk)
  })
  let clean = cleanPolys(polys)
  let high = getHighestCoords(clean)
  let coordsOfHighest = createCoords(high)
  let largestArea = helper.getArea(coordsOfHighest)
  let areas = addArea(clean)
  let filteredBoxes = areas.filter(a => {
    let acceptableArea = largestArea / 5
    if (a.area < acceptableArea) return a.area
  })
  let enlargedBoxes = filteredBoxes.map(a => {
    a.enlargedCoords = increaseArea(__.cloneDeep(a.coords), 5, 7.5)
    return a
  })
  renderBoxes(enlargedBoxes, canvas)
  testIntersection(canvas)
  let boxesWithGroupId = addGroupIds(extractGroupIds(canvas), enlargedBoxes)
  let speechBubbles = filterBucket(groupForHull(boxesWithGroupId), 8)
  let convexSpeechBubbles = mapXYArrayToXYObject(
    speechBubbles.map(a => {
      return ch(a)
    })
  )
  convexSpeechBubbles.forEach(c => {
    renderBox(c, canvas)
  })
  return convexSpeechBubbles
}

const renderBoxes = (arr, canvas) => {
  arr.forEach(a => {
    let largePoly = new fabric.Polygon(a.enlargedCoords, {
      left: a.enlargedCoords[0].x,
      top: a.enlargedCoords[0].y,
      stroke: 'white',
      strokeWidth: 1,
      fill: 'rgba(0,0,0,0)',
      id: a.id
    })

    let poly = new fabric.Polygon(a.coords, {
      left: a.coords[0].x,
      top: a.coords[0].y,
      stroke: 'red',
      strokeWidth: 1,
      fill: 'rgba(0,0,0,0)',
      id: a.id
    })
    canvas.add(poly)
    canvas.add(largePoly)
  })
}

// simple function to render one polygon of {x, y} coordinates

const renderBox = (arr, canvas) => {
  let poly = new fabric.Polygon(arr, {
    stroke: 'white',
    strokeWidth: 1,
    fill: 'white'
  })
  canvas.add(poly)
}

// add coordinates if none were added (don't think coords added if 0 for example)

const cleanPolys = arr => {
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

// get highest coords so can discard any excessively large areas

const getHighestCoords = arr => {
  let highestX = 0
  let highestY = 0
  let lowestY = null
  let lowestX = null
  var o = { highestX, highestY }
  for (let box of arr) {
    for (let coord of box.coords) {
      if (coord.x > highestX) {
        o.highestX = coord.x
      }
      if (coord.y > highestY) {
        o.highestY = coord.y
      }
      if (coord.y < lowestY) {
        o.lowestY = coord.y
      }
      if (coord.x < lowestX) {
        o.lowestX = coord.x
      }
    }
  }
  return o
}

// create coordinates from highest/lowest check above

const createCoords = o => {
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

// increase area of text box to enable intersection check

const increaseArea = (c, xInc, yInc) => {
  c[0].x = c[0].x - xInc
  c[0].y = c[0].y - yInc
  c[3].x = c[3].x - xInc
  c[3].y = c[3].y + yInc
  c[1].x = c[1].x + xInc
  c[1].y = c[1].y - yInc
  c[2].x = c[2].x + xInc
  c[2].y = c[2].y + yInc
  return c
}

// test intersection to give a groupId

const testIntersection = canvas => {
  let i = 1
  canvas.forEachObject(function (polyOne) {
    canvas.forEachObject(function (polyTwo) {
      if (polyOne.intersectsWithObject(polyTwo)) {
        // if polyOne has no existing group but two does, give polyOne, two’s ID
        if (!polyOne.groupId && polyTwo.groupId) {
          polyOne.groupId = polyTwo.groupId
        }
        // reverse
        if (polyOne.groupId && !polyTwo.groupId) {
          polyTwo.groupId = polyOne.groupId
        }
        // if neither poly has an id but they intersect, then need to create new group
        if (!polyOne.groupId && !polyTwo.groupId) {
          i++
          polyOne.groupId = i
          polyTwo.groupId = i
        }
        if (polyOne.groupId && polyTwo.groupId) {
          if (polyOne.groupId < polyTwo.groupId) {
            polyTwo.groupId = polyOne.groupId
          }
          if (polyTwo.groupId < polyOne.groupId) {
            polyOne.groupId = polyTwo.groupId
          }
        }
      }
    })
  })
}

// convert canvas to object to allow extraction of group Ids

const extractGroupIds = canvas => {
  const canv = canvas.toObject(['groupId', 'id'])
  let ids = canv.objects.map(o => {
    return {
      id: o.id,
      groupId: o.groupId
    }
  })
  return ids
}

// add newly discovered groupId to original array

const addGroupIds = (ids, arr) => {
  arr.forEach(a => {
    ids.forEach(b => {
      if (b.id === a.id) {
        a.groupId = b.groupId
      }
    })
  })
  return arr
}

// create separate array containing arrays of array of coordinates
// ;[[[1, 2], [2, 4]], [2, 4], [1, 2]]

const groupForHull = arr => {
  return _.values(_.groupBy(arr, 'groupId')).map(v => {
    return _.flatten(
      v.map(i => {
        return i.coords.map(c => {
          return _.values(c)
        })
      }),
      true
    )
  })
}

// function to create x, y objects from given array

const createXY = a => {
  return { x: a[0], y: a[1] }
}

const mapXYArrayToXYObject = arr => {
  return arr.map(v => {
    return v.map(i => {
      return createXY(i)
    })
  })
}

// filter groups down on basis that if only X polys, unlikely to be text box (on basis that poly is usually 1 word)

const filterBucket = (arr, y) => {
  let filteredArray = []
  arr.forEach(n => {
    if (n.length > y) filteredArray.push(n)
  })
  return filteredArray
}
