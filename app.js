const path = require('path')
const _ = require('underscore')
const __ = require('lodash')
// const concaveman = require('concaveman')
const ch = require('quick-hull-2d')
const fabric = require('fabric').fabric
// const Jimp = require('jimp')
const canvas = fabric.createCanvasForNode(690, 984, {})
canvas.setBackgroundColor(
  'rgba(255, 73, 64, 0.6)',
  canvas.renderAll.bind(canvas)
)
const canvasTwo = fabric.createCanvasForNode(690, 984, {})
canvasTwo.setBackgroundColor(
  'rgba(255, 73, 64, 0.6)',
  canvas.renderAll.bind(canvas)
)
/*
var komika = new canvasTwo.Font(
  'Komika',
  path.join(__dirname, '/public/KOMIKAX_.ttf')
)
canvasTwo.contextContainer.addFont(komika) */
const fs = require('fs')
const data = require('./public/results.json')
const annotations = data.textAnnotations
const polys = annotations.map(a => {
  return {
    coords: a.boundingPoly.vertices,
    area: null,
    id: null,
    groupId: null
  }
})
polys.forEach((p, i) => {
  p.id = i
})

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

const out = fs.createWriteStream(path.join(__dirname, '/output/poly.png'))

let stream = canvas.createPNGStream()
stream.on('data', function (chunk) {
  out.write(chunk)
})

const groupOut = fs.createWriteStream(path.join(__dirname, '/output/group.png'))

let groupStream = canvasTwo.createPNGStream()
groupStream.on('data', function (chunk) {
  groupOut.write(chunk)
})

let clean = cleanPolys(polys)
let high = getHighestCoords(clean)
let coordsOfHighest = createCoords(high)
let largestArea = calculateArea(coordsOfHighest)
let areas = addArea(clean)
let filteredBoxes = areas.filter(a => {
  let acceptableArea = largestArea / 1
  return a.area < acceptableArea
})

let enlargedBoxes = filteredBoxes.map(a => {
  a.enlargedCoords = increaseArea(__.cloneDeep(a.coords), 5, 7.5)
  return a
})

renderBoxes(enlargedBoxes, canvas)
testIntersection(canvas)
let ids = extractGroupIds(canvas)
let boxesWithGroupId = addGroupIds(ids, enlargedBoxes)

// Convex malarkey

let arrayOfHulls = filterBucket(groupForHull(boxesWithGroupId), 8)

let convexes = mapXYArrayToXYObject(
  arrayOfHulls.map(a => {
    return ch(a)
  })
)

exports.getData = function (fn) {
  return fn(null, convexes)
}

convexes.forEach(c => {
  renderBox(c, canvas)
})

// fs.writeFile('grouped.json', JSON.stringify(concaves))

// Grouping using coordinates from 'Group' in Fabric JS (so very basic)
/*
let canvasBucket = addPolysToCanvas(boxesWithGroupId)
let groupedPolys = groupPolys(canvasBucket)
let filteredBucket = filterBucket(groupedPolys, 2)
addGroupsToCanvas(canvasTwo, filteredBucket)
*/
// render normal and larger boxes to canvas to show difference

function renderBoxes (arr, canvas) {
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

function renderBox (arr, canvas) {
  let poly = new fabric.Polygon(arr, {
    // left: arr[0].x,
    // top: arr[0].y,
    stroke: 'white',
    strokeWidth: 1,
    fill: 'white'
  })
  canvas.add(poly)
}

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

// add coordinates if none were added (don't think coords added if 0 for example)

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

// get highest coords so can discard any excessively large areas

function getHighestCoords (arr) {
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

// increase area of text box to enable intersection check

function increaseArea (c, xInc, yInc) {
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

function testIntersection (canvas) {
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

function extractGroupIds (canvas) {
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

function addGroupIds (ids, arr) {
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

function groupForHull (arr) {
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

function createXY (a) {
  return { x: a[0], y: a[1] }
}

function mapXYArrayToXYObject (arr) {
  return arr.map(v => {
    return v.map(i => {
      return createXY(i)
    })
  })
}

// create polys to enable grouping (as groups are created from an array of Fabric polys)

function addPolysToCanvas (arr) {
  let polyBucket = []
  arr.forEach(a => {
    let poly = new fabric.Polygon(a.coords, {
      // first x,y in array may not be top left point leading to misplacement of polygon
      left: a.coords[0].x,
      top: a.coords[0].y,
      stroke: 'red',
      strokeWidth: 1,
      fill: 'rgba(0,0,0,0)',
      id: a.id,
      groupId: a.groupId
    })
    polyBucket.push(poly)
  })
  return polyBucket
}

// group polys to create separate arrays per group to allow creation of groups

function groupPolys (polys) {
  let groupedPolygons = _.groupBy(polys, 'groupId')
  let target = _.values(groupedPolygons)
  /*
  let groupedPolys = target.map(t => {
    return t[1]
  }) */
  return target
}

// filter groups down on basis that if only X polys, unlikely to be text box (on basis that poly is usually 1 word)

function filterBucket (arr, y) {
  let filteredArray = []
  arr.forEach(n => {
    if (n.length > y) filteredArray.push(n)
  })
  return filteredArray
}

// create groups and extract coords of group and create polys from them

function addGroupsToCanvas (canvas, arr) {
  arr.forEach(g => {
    let groupId = g[0].groupId
    let group = new fabric.Group(g, {
      groupId: groupId
    })
    let co = group.aCoords
    let poly = new fabric.Polygon(
      [
        { x: co.tl.x, y: co.tl.y },
        { x: co.tr.x, y: co.tr.y },
        { x: co.br.x, y: co.br.y },
        { x: co.bl.x, y: co.bl.y }
      ],
      {
        left: co.tl.x,
        top: co.tl.y,
        // fill: 'rgba(0,0,0,0)',
        fill: 'white',
        groupId: groupId
      }
    )
    let num = groupId.toString()
    let text = new fabric.Text(num, {
      left: co.tl.x + 5,
      top: co.tl.y + 5,
      stroke: 'black',
      fontFamily: 'Arial',
      fontSize: 15
    })

    canvas.add(poly)
    canvas.add(text)
  })
}
/*
const newCanv = canvasTwo.toObject(['groupId', 'id'])
fs.writeFile('grouped.json', JSON.stringify(newCanv.objects))

let groups = newCanv.objects.map(o => {
  return {
    id: o.id,
    groupId: o.id,
    coords: o.points
  }
})
*/
