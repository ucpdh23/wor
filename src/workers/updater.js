const Group = require('../dto/group');
const hull = require('../service/hull');

var nextTime = 0;

var counter = 0;
var sumTime = 0;

/**
 * delta in milliseconds
 * stage context information
 */
function update(delta, stage) {
  // computo de variables
  var one_timestamp=new Date().getTime()

  var delta = delta / 1000;
  var meters = 0;

  var cyclists = stage.cyclists;
  var profile = stage.profile;

  var first = cyclists[0];
  var last = cyclists[0];

  var total_count = cyclists.length;
  
  // generamos list...
  var list = cyclists.slice(0)
  
  var aux_list = [];
  list.forEach(cyclist => {
    if (cyclist.position.x < profile.getLengthInMeters()) {
      aux_list.push(cyclist);
    } else {
      stage.addFinished(cyclist);
    }
  });
  
  // ...Quitamos los que han acabado
  list = aux_list;
  
  // ...los ordenamos
  list.sort((a, b) => {
    return b.position.x - a.position.x;
  });
  
  // ...numero de elementos
  var items = list.length;
  
  // info de debug
  if (stage.timestamp  > nextTime) {
    displayMetrics(stage, items, list);
  }

/* 20230607 quito esto porque esta duplicado con lo de antes
  // ordenacion de ciclistas
  var list = cyclists.slice(0)
  list.sort((a, b) => {
    return b.position.x - a.position.x;
  });

  // Quitar aquellos que ya hayan acabado la etapa.
  list = list.filter(cyclist => cyclist.position.x < profile.getLengthInMeters());
  
  */
  

  // debug
  if (stage.timestamp  > nextTime) {
    displayMetrics(stage, items, list);
  }

  // actualizacion de grupos
  var groups = computeGroups(list);
  stage.setGroups(groups);
  
  for (i=0;i<groups.length;i++) {
    groups[i].update();
  }

  // para cada ciclista se calcula su entorno, se actualiza la maquina de estados, se calcula la energia que aplicar
  for (i = 0; i < items; i++) {
    var environment = profile.computeEnvironment(list[i]);
    list[i].computeNeighbour(list, i, environment);
  }

  if (stage.debug && stage.debug.cyclist) {
      stage.debug.cyclist.logCyclist(profile);
    }

  // para cada ciclista se hace la actualizacion
  for (i = 0; i < items; i++) {
    currMeters = list[i].update(delta);
    if (currMeters > meters)
      meters = currMeters
  }

  //  profile.update(delta);
  // se acrualizan los equipos
  stage.teams.forEach(item => {
    item.update(stage);
  })

  
  stage.updateTimestamp(delta);

  var two_timestamp = new Date().getTime()

  var diff = two_timestamp - one_timestamp;

  sumTime += diff;
  counter++;

  return stage.status < 10;
}

function computeGroups(list) {
  var groups = [];
  var currGroup = null;
  var prev = 1000000;
  var groupIndex = 0;
  for (i = 0; i < list.length; i++) {
    if (prev - list[i].position.x > 10) {
      currGroup = new Group(prev - list[i].position.x, groupIndex++);
      groups.push(currGroup);
    } 

    prev = list[i].position.x;
    currGroup.addCyclist(list[i]);
  }
  
  return groups;
}

function displayMetrics(stage, items, list) {
  var avg = sumTime / counter

  if (process.env.CREATE_METRICS === undefined) {
    
  } else if (process.env.CREATE_METRICS == 'true'){
     console.log("tic:" + parseInt(stage.timestamp) + " secs [" + avg + "]")
     for (i = 0; i < items; i++) {
       list[i].logCyclist();
     }
  }

  counter = 0;
  sumTime=0;

  
  nextTime = nextTime + 10;
}

module.exports.update = update;