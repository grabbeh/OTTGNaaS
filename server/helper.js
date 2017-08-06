const _ = require('underscore')

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
  let xs = arr.map(a => {
    return a.x
  })
  let ys = arr.map(a => {
    return a.y
  })
  xs.sort((a, b) => {
    return a - b
  })
  ys.sort((a, b) => {
    return a - b
  })
  const width = _.last(xs) - _.first(xs)
  const height = _.last(ys) - _.first(ys)
  const area = width * height
  return area
}
