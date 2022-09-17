

function computeMainActors(prType, cyclists) {
  var combi = prType.type * 100 + prType.end * 10 + prType.distance;
  console.log('profileType:'+combi)
  
  const map = new Map(
     cyclists.map(object => {
       return [object.id, object];
      })
     );
  
  var items = cyclists.map(i => {
        return {
          id: i.id,
          value: _computeValue(i, combi)
        }
      });
      
  items.sort((a,b)=> {
        return b.value - a.value;
      });
  
  var output = [];
  for (var i=0; i < 20; i++) {
    console.log(items[i]);
    var actor = map.get(items[i].id);
    actor.setMainActor(i);
    output.push(actor);
  }
  
  return output;
}

function _computeValue(cyclist, combi) {
  var e = cyclist.energy;
  
  switch (combi) {
    case 111: case 112: case 113:
    case 121: case 122: case 123:
    case 131: case 132: case 133:
      return e.llano + e.sprint;
    case 211: case 212: case 213:
    case 221: case 222: case 223:
    case 231: case 232: case 233:
      return e.llano + e.montana;
    case 311: case 312: case 313:
    case 321: case 322: case 323:
    case 331: case 332: case 333:
      return e.montana;
    default:
      break
  }
}

exports.computeMainActors = computeMainActors;