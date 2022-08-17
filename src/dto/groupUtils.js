
/**
 * returns 0 if last in group
 *         1 if first in group
 *         0-1 depending on position
 */
function positionInGroup(group, cyclist) {
  var initX = group.getFirst().position.x;
  var lastX = group.getLast().position.x;
  
  var actualX = cyclist.position.x;
  
  var diffGroup = initX - lastX;
  var diffCyclist = actualX - lastX;
  
  return diffCyclist / diffGroup;
}

exports.positionInGroup = positionInGroup;