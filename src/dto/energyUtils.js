function computeLevelPull(cyclist) {
  
  var currLevel = cyclist.energy.resolvePercentage();
  
  var expected = currLevel + 17;
  
  if (expected < 90)
    return expected;
  else
    return null;
}