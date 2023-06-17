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
    }
    
    preload() {
      console.log('preload scene play');
    }
    
    create() {
      console.log("create scene")
      /*
      this.add.line(
        0, 0,
        0, 0,
        1000000, 60, 0xffff00);
      /*
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
      
      var profile = this.model.get('profile');
      
      console.log("profole.etapa", profile.etapa);
      
      let kms_index = profile.etapa.length;
      
      for (var i=0; i < kms_index; i++) {
        this.add.line(
        0, 0,
        i*10000, 0,
        i*10000, 750, 0xffff00);
        this.add.text(
          i*10000, 20,
          ""+i+"km"
          );
      }
      
      for (var i=0; i<5; i++) {
        this.add.line(
        0, 0,
        kms_index*10000 - i*1000, 0,
        kms_index*10000 - i*1000, 750, 0xff0000);
        this.add.text(
          kms_index*10000 - i*1000, 0,
          ""+i+"00 mts"
          );
      }
      
      
      this.cyclists = [];
      
      for (var cyclist of this.model.get('cyclists')) {
        var item = new Cyclist(this, cyclist, this.emitter);
        this.cyclists.push(item);
      }
      
      //this.cameras.main.setSize(200, 200);
      this.cameras.main.startFollow(this.cyclists[0]);
      
      this.emitter.on('updatedStatus', this.updatedStatus, this);
      this.emitter.on('selectedCyclist', this.selectedCyclist, this);
      
      this.input.on("pointermove",
         function (p) {
           //console.log('pointermove');
           if (!p.isDown) return;
           //console.log('pointermove2');
           
           var xOffset = (p.x - p.prevPosition.x) / this.cameras.main.zoom;
           //console.log(xOffset);
           var currOffset = this.cameras.main.followOffset.x;
           this.cameras.main.setFollowOffset(currOffset - xOffset, 0)
           
           
         }
      );
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
