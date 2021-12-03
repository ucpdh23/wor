function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function dec(num, mul){
  var aux = (num < 0)? "" : "+";
  return aux + num.toFixed(mul);
  //return ""+((parseInt(num*mul))/mul).toFixed(2);
}

function findCyclist(id) {
    for (var i = 0; i < cyclists.length; i++) {
        if (cyclists[i].id === id) {
            return cyclists[i];
        }
    }

    return null;
}

function detectOrientation(){
  return !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape'
}

function rgbToHex(rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

function strTime(time){
  var mins = parseInt(time / 60);
  var secs = parseInt(time) % 60;
  
  return pad(mins, 2) + ":" + pad(secs, 2);
}

function computeMedium(list) {
  let result = {
    llano: 0,
    montana: 0,
    bajada: 0,
    sprint: 0,
    estadoForma: 0
  };
  let size = list.length;
  
  for (item of list){
    result.llano += item.energy.llano / size;
    result.montana+=item.energy.montana/size;
    result.bajada +=item.energy.bajada/ size;
    result.sprint +=item.energy.sprint/ size;
  }
  
  console.info('med.montana:'+dec(result.montana, 100));
  
  return result;
}

function createOutputCyclist(item) {
  return {id: item.id, number : item.number,
    position : {x: item.position.x, y: item.position.y},
    velocity: {x: item.velocity.x, y: item.velocity.y},
    acceleration: {x: item.acceleration.x, y: item.acceleration.y},
    energy: {llano: item.energy.llano, montana: item.energy.montana, bajada: item.energy.bajada},
    state: {value: item.peekStateMachine().value}
  };
}

function createOutputCyclists(list) {
  var output = []
  for (var i =0; i < list.length; i++) {
    var item = list[i];
    output.push(createOutputCyclist(item));
  }

  return output;
}

function findCyclist(state, id) {
  for (var i =0; i < state.cyclists.length; i++) {
    var item = state.cyclists[i];
    if (item.id === id) return item;
  }

  throw "not found";
}

function createOutputCyclistsForWebservice(list) {
  var output = []
  for (var i =0; i < list.length; i++) {
    var item = list[i];
    output.push({id: item.id, number : item.number,
      position : {x: item.position.x, y: item.position.y},
      velocity: {x: item.velocity.x, y: item.velocity.y},
      acceleration: {x: item.acceleration.x, y: item.acceleration.y},
      pulse: item.energy.pulse2
    });
  }

  return output;
}

function createOutputGroupsForWebSocket(list) {
  var output = []
  for (var i =0; i < list.length; i++) {
    var item = list[i];
    output.push({id: item.id,
      name : item.name,
      gap: item.gapMeters
    });
  }

  return output;
}


function getColorForPercentage(pct, percentColors) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return color;
}


function incrementalUpdate(actual, expected, step=1) {
        
        if (Math.abs(actual - expected) < step*2)
          return expected;
        else if (actual < expected)
          return actual + step;
        else
          return actual - step;
}

function inRange(value, range) {
  return value > range[0] && value < range[1]
}

exports.incrementalUpdate = incrementalUpdate;
exports.dec = dec;
exports.createOutputCyclists = createOutputCyclists;
exports.createOutputCyclistsForWebservice = createOutputCyclistsForWebservice;
exports.findCyclist = findCyclist;
exports.strTime = strTime;
exports.createOutputCyclist = createOutputCyclist;
exports.inRange = inRange;
exports.createOutputGroupsForWebSocket = createOutputGroupsForWebSocket;