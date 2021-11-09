const Vector = require('./cyclist')

class Stage {
  constructor(id) {
    this.id = id;
    this.timestamp = 0;
  }
  
  cyclists = [];
  teams = [];
  groups = [];
  profile = null;
}

module.exports = Stage;