define([], function(){
  var teamClass = function(id) {
    this.id = id;
    this.cyclists =[];
    this.strategy = 0;

    this.addCyclist = function(item) {
      this.cyclists.push(item);
    }
    
    this.setMedium = function(medium) {
      this.medium=medium;
    }
  }

  return teamClass;
});




