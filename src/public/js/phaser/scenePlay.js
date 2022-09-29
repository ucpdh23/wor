define([
  'phaser/cyclist'
 ], function (Cyclist) {
  var ScenePlayClass = class ScenePlay extends Phaser.Scene {
    constructor() {
      super({key : "ScenePlay"});
    }
    
    init(data) {
      this.emitter = data.emitter;
      this.model = data.model;
      console.log('init acene okay')
    }
    
    preload() {
      console.log('preload scene play');
    }
    
    create() {
      /*
      this.line1 = this.add.line(
        0,0,
        0, 20 - 60,
        45000 * 10, 20 - 60, 0xff0000);
      
      this.line2 = this.add.line(
        0,0,
        0, 20 + 60,
        45000 * 10, 20 + 60, 0xff0000);
        
      for (var i = 0; i < 20000; i++) {
        this.add.line(
          0,0,
          i*40, 20,
          i*40+20, 20,
          0xff0000);
      }
      
      for (var i=0;i<50;i++) {
        this.add.line(
          0,0,
          i*10*1000, 20-60,
          i*10*1000, 20+60,
          0xff0000);
        this.add.line(
          0,0,
          i*10*1000+ 5000, 20-60,
          i*10*1000+ 5000, 20+60,
          0xffff00);
      }
      */
      
      this.add.tileSprite(0, 0, 1000000, 200, 'road');
      
      this.cyclists = [];
      
      for (var cyclist of this.model.get('cyclists')) {
        var item = new Cyclist(this, cyclist, this.emitter);
        this.cyclists.push(item);
      }
      
      //this.cameras.main.setSize(200, 200);
      this.cameras.main.startFollow(this.cyclists[0]);
      
      this.emitter.on('updatedStatus', this.updatedStatus, this);
      this.emitter.on('selectedCyclist', this.selectedCyclist, this);
    }
    
    updatedStatus(){
    }
    
    selectedCyclist(index) {
      console.log('follow', index);
      this.cameras.main.startFollow(this.cyclists[index]);
    }
    }
    
    return ScenePlayClass;
});
