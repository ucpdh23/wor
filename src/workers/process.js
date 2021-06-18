var process = function(delta, status) {
  status.timestamp += delta;
}

module.exports = { process };