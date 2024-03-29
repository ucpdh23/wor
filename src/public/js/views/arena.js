define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/arena.html',
    'graphics/ViewportManager',
    'phaser/bootloader',
    'phaser/scenePlay'
  ], function($, _, Backbone, template, ViewportManager, Bootloader, ScenePlay){
    var ArenaView = Backbone.View.extend({
      
      template: _.template(template),

      initialize(options) {
          options.vent.bind("updatedStatus", this.updatedStatus, this);
          options.vent.bind("selectedCyclist", this.selectedCyclist, this);
          options.vent.bind("setupAudio", this.setupMusic, this);
          options.vent.bind("createStage", this.createStage, this);
          
          
          this.viewport = null;
          this.features = {
            canvasWidth: Math.max($( window ).width(), 1500),
            canvasHeight: $( window ).height() * 0.6,
            backgroundColor: 40,
            maxSizeViewPort: 100,
            reference: 5, //10 * 1.5,
            scale: ($( window ).height() > 300)? 1.8 : 1.1,
          };
      },
      
      createStage: function() {
        console.log('createStage');
        this.emitter.emit('createStage');
      },

      updatedStatus: function(status) {
        var maxMeters = this.model.get("maxMeters");

        if (this.viewport != null) {
          this.viewport.updateViewport(this.model, maxMeters);
        }
        if (this.emitter) {
          this.emitter.emit('updatedStatus', this.model);
        }
      },

      selectedCyclist: function(number) {
        if (this.viewport != null) {
          this.viewport.setPreselectedNumber(number);
        } else if (this.emitter) {
          var item = this.model.getByNumber(number);
          this.emitter.emit('selectedCyclist', item.id);
        }
      },
      
      setupMusic: function(mute) {
        if (mute) {
          if (this.song.isPlaying()) {
            this.song.stop();
            this.race.stop();
          }
        } else {
          this.song.play();
          this.race.play();
        }
      },

      render: function(){
        var data = {};

        this.$el.html(this.template(data) );

        var song;
        var race;
        
        var that = this;
/*
        let sketch = p => {
            p.preload = () => {
              that.song = p.loadSound('assets/music.ogg')
              that.race = p.loadSound('assets/race.mp3')
            }

            p.setup = () => {
              if (that.model.get("setup").audio) {
                that.song.loop();
                that.race.play();
              }

                var canvas = p.createCanvas(this.features.canvasWidth, this.features.canvasHeight);
                canvas.parent('sketch-holder')

                p.frameRate(20)
            }

            p.draw = () => {

              p.background(this.features.backgroundColor);

              this.viewport.draw(p);
            }

        };
        */
        //console.log("Bootstrap", Bootstrap);
        var config = {
          width: window.innerWidth, //320,
          height: 200,
          parent: 'sketch-holder',
          type: Phaser.AUTO,
          scene: [
            Bootloader,
            ScenePlay
            ]
          /*{
            preload: function()  {
              console.log(this)
              console.log('preload')
              this.load.image('pajaro', 'assets/bird.png');
            },
            create: function() {
              console.log('create')
              this.add.image(100, 100, 'pajaro');
            },
            update: function() {
              // console.log('update')
            }
          }*/
        };
        
        this.emitter = new Phaser.Events.EventEmitter();

        this.sketchHolder = new Phaser.Game(config);
        var data = {
          'emitter' : this.emitter,
          'model' : this.model
        };
        this.sketchHolder.scene.start('bootloader', data);
 

        //this.viewport = new ViewportManager(sketchHolder, this.features);

      }
    });

    return ArenaView;
  });