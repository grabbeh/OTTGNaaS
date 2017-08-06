const _ = require('underscore')

const getArea = arr => {
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

  const width = _.first(xs) - _.last(xs)
  const height = _.first(ys) - _.last(ys)
  const area = width * height
  return area
}

const coords = [
  { x: 909, y: 1345 },
  { x: 911, y: 1345 },
  { x: 911, y: 1354 },
  { x: 909, y: 1354 }
]

const result = getArea(coords)

console.log(result)
