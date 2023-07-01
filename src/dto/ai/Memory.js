class Memory {
    constructor(team, stage) {
        this.team = team;
        this.stage = stage;
        
        this.shortMemory = new Map();
        this.longMemory = new Map();
    }
 

    addAction(action, state) {
        this.shortMemory = new Map();
    }
}

module.exports = Memory