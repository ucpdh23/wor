class Group {
    cyclists = [];
    cyclistsId = [];

    tirando = []

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
      
      cyclist.group = this;
      if (this.avg < this.computeAvg(cyclist)) {
        this.id = cyclist.id;
        this.name = cyclist.number;
      }
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
  }

  module.exports = Group;