var Vector = require('./NewVector').Vector;

class CyclistListener {
  constructor() {
    this.lastChangeTimestamp =
    new Date().getTime();
    this.lastChangePosition =
    new Vector(0,0,0);
  }
  
        loadContext(ctx) {
          ctx.lastChangeTimestamp = this.lastChangeTimestamp;
          ctx.lastChangePosition = this.lastChangePosition;
        }
        storeContext(ctx){
          this.lastChangeTimestamp = new Date().getTime();
          this.lastChangePosition = ctx.cyclist.position.get();
        }
}

module.exports = CyclistListener;