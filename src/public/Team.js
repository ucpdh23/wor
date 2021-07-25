class Team {
    static _id = 0;
    
    constructor() {
      this.cyclists =[];
      this.strategy = 0;
      this.id = Team._id++;
    }
    
    addCyclist(item) {
      this.cyclists.push(item);
    }
    
    setMedium(medium) {
      this.medium=medium;
    }
  
}

