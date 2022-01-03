define([], function(){
    const energyClass = function(data) {
        this.llano = data.llano;
        this.montana = data.montana;
        this.bajada = data.bajada;
        this.sprint = data.sprint;
        this.estadoForma = data.estadoForma;
    };
  
    return energyClass;
  });
  