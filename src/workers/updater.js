const Group = require('../dto/Group');
const hull = require('../service/hull');

function update(delta, stage) {
  var delta = delta / 1000;

  var meters = 0;

  var cyclists = stage.cyclists;
  var profile = stage.profile;

  var first = cyclists[0];
  var last = cyclists[0];

  var items = cyclists.length;

  var localHull = [];
  localHull.push([cyclists[0].position.x, cyclists[0].position.y]);

  for (i = 1; i < items; i++) {
    if (first.position.x < cyclists[i].position.x)
      first = cyclists[i];

    if (last.position.x > cyclists[i].position.x)
      last = cyclists[i];

    localHull.push([cyclists[i].position.x, cyclists[i].position.y]);
  }

  globalFirst = first;


  var list = cyclists.slice(0)
  list.sort((a, b) => {
    return b.position.x - a.position.x;
  });


  var currGroup = null;
  var prev = 1000000;
  for (i = 0; i < items; i++) {
    if (prev - list[i].position.x > 10) {
      currGroup = new Group();
    }
    prev = list[i].position.x;
    currGroup.addCyclist(list[i]);
  }

  var hullPoints = hull(localHull, 10);
  globalHull = hullPoints;

  for (i = 0; i < items; i++) {
    var environment = profile.computeEnvironment(cyclists[i]);
    cyclists[i].computeNeighbour(cyclists, i, first, last, environment);
  }
  /*
    var list = cyclists.slice(0)
    list.sort((a,b)=>{
      return b.position.x - a.position.x;
    });
    
    
    var currGroup=null;
    var prev = 1000000;
    for (i = 0; i < items; i++) {
      if (prev - list[i].position.x > 10) {
        currGroup = new Group();
      }
      prev = list[i].position.x;
      currGroup.addCyclist(list[i]);
    }
    */
  for (i = 0; i < items; i++) {
    currMeters = cyclists[i].update(delta);
    if (currMeters > meters)
      meters = currMeters
  }

  //  profile.update(delta);
  stage.teams.forEach(item => {
    item.update();
  })

  stage.timestamp += delta;
}

module.exports.update = update;