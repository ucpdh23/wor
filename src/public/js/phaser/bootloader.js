define([], function () {
  var BootloaderClass = class Bootloader extends Phaser.Scene {
    constructor() {
      super("bootloader");
      console.log('constructor');
    }
    
    init(data) {
      console.log('init', data)
      //console.trace()
      this.emitter = data.emitter;
      this.model = data.model;
      
      this.emitter.on('createStage', this.createStage, this);
    }
    
    createStage() {
      console.log(' creates stage on bootloader');
      
      //this.load.on("complete", () => {
        var data = {
          'emitter' : this.emitter,
          'model' : this.model
        };
        this.scene.start('ScenePlay', data);
      //});
    }
    
    preload() {
      this.load.image('pajaro', 'assets/bird.png');
      this.load.image('cyclist', 'assets/cyclist_xs_2.png');
      this.load.image('road', 'assets/road.png');
    }
    
    
    }
    
    return BootloaderClass;
});
