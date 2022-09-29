define([], function () {
  var CyclistClass = class Cyclist extends Phaser.GameObjects.Sprite {
    constructor(scene, cyclist, emitter) {
      
      super(scene, 0,0,'cyclist');
      this.scale = 0.6;
      console.log(this.scale);
      //this.scale.setTo(0.5,0.5);
      scene.add.existing(this);
      this.emitter = emitter;
      this.cyclist = cyclist;
      
      this.emitter.on('updatedStatus', this.updatedStatus, this);
      
      this.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
    console.log('touch');
});

    }
    
    updatedStatus() {
      this.setPosition(this.cyclist.position.x*10, 0 + this.cyclist.position.y*10);
    }
    
    }
    
    return CyclistClass;
});
