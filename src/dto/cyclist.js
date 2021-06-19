const Vector = require('./vector')

class Cyclist {
  constructor(id) {
    this.id = id;
  }
  
  velocity = new Vector(0,0);
  position = new Vector(0,0);
  acceleration = new Vector(0,0);
}

module.exports = Cyclist;