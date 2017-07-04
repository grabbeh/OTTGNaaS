exports.getWidth = a => {
  let lowestX = a[0].x
  let highestX = a[0].x
  a.forEach(i => {
    if (i.x < lowestX) lowestX = i.x
    if (i.x > highestX) highestX = i.x
  })
  return highestX - lowestX
}

exports.getTopLeft = a => {
  let lowestX = a[0].x
  let lowestY = a[0].y
  a.forEach(i => {
    if (i.x < lowestX) lowestX = i.x
    if (i.y < lowestY) lowestY = i.y
  })
  return {
    x: lowestX,
    y: lowestY
  }
}

exports.getArea = arr => {
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

exports.matchTextLengthToArea = () => {}
