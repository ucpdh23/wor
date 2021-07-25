class Group {
    cyclists = [];
    cyclistsId = [];
    
    constructor() {
    }
    
    addCyclist(cyclist){
      this.cyclists.push(cyclist);
      this.cyclistsId.push(cyclist.id);
      
      cyclist.group = this;
    }
    
    indexOf(id){
      return this.cyclistsId.indexOf(id);
    }
    
    getFirst(){
      return this.cyclists[0];
    }
  }

  module.exports = Group;