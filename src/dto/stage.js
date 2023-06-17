const Vector = require('./cyclist')
const GroupsManager = require('../service/groupsManager')

class Stage {
  constructor(id) {
    this.id = id;
    this.timestamp = 0; // en segundos
    this.outOfControl = -1;
    this.status = 0;
  }
  
  cyclists = [];
  finishedCyclists = [];
  
  teams = [];
  groups = [];
  profile = null;

  init() {
    this.groupsManager = new GroupsManager(this);
    this.groupsManager.init();
  }

  setGroups(groups) {
    this.groups = this.groupsManager.updateGroups(groups, this.groups);
  }
  
  setActors(mainActors) {
    this.actors = mainActors;
  }
  
  addFinished(cyclist) {
    if (!cyclist.isFinished) {
      this.finishedCyclists.push({
        timestamp: this.timestamp,
        cyclist: cyclist
      });
      cyclist.isFinished = true;
    }
    
    if (this.finishedCyclists.length == 1) {
      console.log("primer ciclista en acabar. definir fuera de control", cyclist);
      this.outOfControl = this.timestamp*1.50;
      this.status = 3;
    } else if (this.finishedCyclists.length == this.cyclists.length) {
      this.status = 11;
    }
    
  }
  
  updateTimestamp(delta) {
    this.timestamp += delta;
    if (this.status == 3 && this.timestamp > this.outOfControl) {
      this.status = 12;
    }
  }
  setProfile(profile) {
    this.profile = profile;
  }
  
  getFirst() {
    if (this.groups.length == 0) return null;
    return this.groups[
      this.groups.length-1
      ].getFirst();
  }
  
}

module.exports = Stage;