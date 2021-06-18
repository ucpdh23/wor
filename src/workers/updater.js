function update(delta, status) {
  status.timestamp += delta;
}

module.exports.update = update;