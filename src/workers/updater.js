const Group = require('../dto/group');
const hull = require('../service/hull');

var nextTime = 0;

var counter = 0;
var sumTime = 0;

function update(delta, stage) {
  var one_timestamp = new Date().getTime()

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

  // Quitar aquellos que ya hayan acabado la etapa.
  list = list.filter(cyclist => cyclist.position.x < profile.getLengthInMeters());

  if (stage.timestamp  > nextTime) {
    displayMetrics(stage, items, list);
  }


  var groups = [];
  var currGroup = null;
  var prev = 1000000;
  var groupIndex = 0;
  for (i = 0; i < items; i++) {
    if (prev - list[i].position.x > 10) {
      currGroup = new Group(prev - list[i].position.x, groupIndex++);
      groups.push(currGroup);
    } 

    prev = list[i].position.x;
    currGroup.addCyclist(list[i]);
  }

  stage.groups = groups;


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
    if (stage.debug && stage.debug.cyclist) {
      stage.debug.cyclist.logCyclist(profile);
    }

    
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

  var two_timestamp = new Date().getTime()

  var diff = two_timestamp - one_timestamp;

  sumTime += diff;
  counter++;


  return true;
}

function displayMetrics(stage, items, list) {
  var avg = sumTime / counter

  console.log("tic:" + parseInt(stage.timestamp) + " secs [" + avg + "]")
  for (i = 0; i < items; i++) {
    list[i].logCyclist();
  }

  counter = 0;
  sumTime=0;

  
  nextTime = nextTime + 10;
}

module.exports.update = update;