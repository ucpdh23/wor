const hull = require('../service/hull');

class Group {
    cyclists = [];
    cyclistsId = [];

    tirando = []
    hullItems = []

    constructor(gapMeters, index) {
      this.id = 10000;
      this.index = index;
      this.avg = 0;
      this.name = '';
      this.gapMeters = gapMeters;
    }
    
    addCyclist(cyclist){
      this.cyclists.push(cyclist);
      this.cyclistsId.push(cyclist.id);
      this.hullItems.push([cyclist.position.x, cyclist.position.y]);
      
      cyclist.group = this;
      if (this.avg < this.computeAvg(cyclist)) {
        this.id = cyclist.id;
        this.name = cyclist.number;
      }
    }
    
    update() {
      this.hullPoints = hull(
        this.hullItems,
        10);
    }

    computeAvg(cyclist) {
      return (cyclist.energy.llano + cyclist.energy.montana) / 2;
    }
    
    indexOf(id){
      return this.cyclistsId.indexOf(id);
    }
    
    getFirst(){
      return this.cyclists[0];
    }
    
    getLast() {
      return this.cyclists[
          this.cyclists.length - 1
        ]
    }
  }

  module.exports = Group;