function process(delta, status) {
  status.timestamp += delta;
}

module.exports.process = process;