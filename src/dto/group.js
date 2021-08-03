class Group {
    cyclists = [];
    cyclistsId = [];

    tirando = []

    constructor() {
      this.id = 10000;
    }
    
    addCyclist(cyclist){
      this.cyclists.push(cyclist);
      this.cyclistsId.push(cyclist.id);
      
      cyclist.group = this;
      if (this.id > cyclist.id) {
        this.id = cyclist.id;
      }
    }
    
    indexOf(id){
      return this.cyclistsId.indexOf(id);
    }
    
    getFirst(){
      return this.cyclists[0];
    }
  }

  module.exports = Group;