const Vector = require('./cyclist')
const GroupsManager = require('../service/groupsManager')

class Stage {
  constructor(id) {
    this.id = id;
    this.timestamp = 0;
    this.status = 0;
  }
  
  cyclists = [];
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
  
  getFirst() {
    return this.groups[
      this.groups.length-1
      ].getFirst();
  }
}

module.exports = Stage;