const Vector = require('./cyclist')
const GroupsManager = require('../service/groupsManager')

class Stage {
  constructor(id) {
    this.id = id;
    this.timestamp = 0;
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
  }
  
  setProfile(profile) {
    this.profile = profile;
  }
  
  getFirst() {
    return this.groups[
      this.groups.length-1
      ].getFirst();
  }
}

module.exports = Stage;