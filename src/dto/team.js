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
    
    computeMedium() {

      var medium = {montana: 0, llano: 0 ,sprint: 0};
      var counter = 0;

      for (var cyclist of this.cyclists) {
        medium.montana += cyclist.montana;
        medium.llano += cyclist.llano;
        medium.sprint += cyclist.sprint;

        counter++;
      }

      medium.montana /= counter;
      medium.llano /= counter;
      medium.sprint /= counter;

      this.medium=medium;
    }
    
    build(profile) {
      console.log("building team " + this.id);

      this.sortCyclists();
      this.computeStatistics();

      let leader = this.cyclists[0];
      if (this.id == 0) return;
      
      if (leader.energy.llano > 80
          && leader.energy.montana > 80) {
        this.strategy = 1;
        this.leader = leader;
        
        this._buildStrategy1();
      } else {
        this.cyclists.forEach(item => {
          if (item.energy.llano > 75 
            && item.energy.montana >
                  this.medium.montana * 1.2
            && item.energy.estadoForma > 95) {
            this.buildStrategy2(item);
          } else if (item.energy.montana > 
                  this.medium.montana*1.1){
            this.buildStrategy3(item);
          }
        });
      }
    }
    
    buildStrategy3(item){
      console.log(''+item.number+ ' esta atento'); 
      item.addAction({
        from: 2000,
        to: 3000,
        prob: 70,
        action: 'avanza',
        payload: 90
      });
    }
    
    buildStrategy2(item) {
      console.log(''+item.number+' debe saltar')
      item.addAction({
        from: 2000,
        to: 3000,
        prob: 90,
        action: 'avanza',
        payload: 90
      })
      item.addAction({
        from: 18050,
        to: 20250,
        prob: 55,
        action: 'salta',
        payload:''
      });
    }
    
    sortCyclists() {
      this.montana=this.cyclists.slice(0);
      this.llano=this.cyclists.slice(0);
      
      this.montana.sort((a,b) => {
        return - a.energy.montana + b.energy.montana
      });
      
      this.llano.sort((a,b)=> {
        return - a.energy.llano + b.energy.llano
      })
    }

    computeStatistics() {
      var avgMontana = this.montana.reduce(function (sum, item) {
        return sum + item.energy.montana;
      }, 0) / this.montana.length;

      var avgLlano = this.llano.reduce(function (sum, item) {
        return sum + item.energy.llano;
      }, 0) / this.llano.length;

      for (var i = 0; i < this.cyclists.length; i++) {
        var cyclist = this.cyclists[i];

        var leader = 60 + Math.random() * 10;
        var innovador = 60 + Math.random() * 10;
        var metodico = 70 + Math.random() * 20;
        var gregario = 70 + Math.random() * 20;

        if (i==0) {
          var monIndex = this.montana.indexOf(cyclist);
          if (monIndex == 0) {
            leader = 85 + Math.random() * 10;
            innovador = 85 + Math.random() * 10;
          } else if (cyclist.energy.montana > avgMontana) {
            leader = 75 + Math.random() * 10;
            innovador = 75 + Math.random() * 10;
          } else {
            leader = 65 + Math.random() * 10;
            innovador = 65 + Math.random() * 10;
          }
        }

        cyclist.setPsicology(leader, innovador, metodico, gregario);
      }
    }

    _buildStrategy1() {
      console.log('team ' + this.id);
      console.log(' leader.number '+ this.leader.number);

      var montana = this.montana.slice(0);
      var llano = this.llano.slice(0);

      
      var leaderMont = montana.indexOf(this.leader);
      var leaderLlano = llano.indexOf(this.leader);
      
      montana.splice(leaderMont, 1);
      llano.splice(leaderLlano, 1);
      
      this.escolta = this.montana[0];
      this.escolta.setPsicology(75, 65, 80, 70)
      
      console.log('im the ' + leaderMont);
      for (var i = 0; i < 3; i++){
        var index = llano.indexOf(this.montana[i]);
        llano.splice(index, 1);
      }
      
      llano[2].addAction({
        from: 0,
        to: 500,
        prob: 90,
        action: 'tira',
        payload: 65
      });
      llano[2].addAction({
        from: 2500,
        prob: 100,
        action: 'no_tira',
        payload: 80
      });
      llano[1].addAction({
        from: 100,
        to: 500,
        prob: 90,
        action: 'avanza',
        payload: 80
      });
      llano[1].addAction({
        from: 2500,
        to: 3000,
        prob: 90,
        action: 'tira',
        payload: 70
      });
      this.leader.addAction({
        from: 1500,
        to: 2000,
        prob: 75,
        action: 'avanza',
        payload: 80
      });
      this.escolta.addAction({
        from: 200,
        to: 250,
        prob: 85,
        action: 'protege',
        payload: this.leader.id
      });
    }
    
    update() {
      if (this.strategy==1) {
        if (Math.random() < 0.001) {
          let diff = globalFirst.position.x - this.leader.position.x;
          if (diff > 15) {
            this.leader.sendMessage('acelera#1');
          }
        } else {
          if (this.leader.slope > 0) {
            
          }
        }
        
        
      }
    }
  }


  module.exports = Team