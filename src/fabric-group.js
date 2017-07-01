// fs.writeFile('grouped.json', JSON.stringify(concaves))

// Grouping using coordinates from 'Group' in Fabric JS (so very basic)

let canvasBucket = addPolysToCanvas(boxesWithGroupId)
let groupedPolys = groupPolys(canvasBucket)
let filteredBucket = filterBucket(groupedPolys, 2)
addGroupsToCanvas(canvas, filteredBucket)

// render normal and larger boxes to canvas to show difference

// create polys to enable grouping (as groups are created from an array of Fabric polys)

const addPolysToCanvas = arr => {
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

const groupPolys = polys => {
  let groupedPolygons = _.groupBy(polys, 'groupId')
  let target = _.values(groupedPolygons)
  /*
  let groupedPolys = target.map(t => {
    return t[1]
  }) */
  return target
}

const filterBucket = (arr, y) => {
  let filteredArray = []
  arr.forEach(n => {
    if (n.length > y) filteredArray.push(n)
  })
  return filteredArray
}

// create groups and extract coords of group and create polys from them

const addGroupsToCanvas = (canvas, arr) => {
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

const newCanv = canvasTwo.toObject(['groupId', 'id'])
fs.writeFile('grouped.json', JSON.stringify(newCanv.objects))

let groups = newCanv.objects.map(o => {
  return {
    id: o.id,
    groupId: o.id,
    coords: o.points
  }
})
