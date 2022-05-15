define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/arena.html',
    'graphics/ViewportManager'
  ], function($, _, Backbone, template, ViewportManager){
    var ArenaView = Backbone.View.extend({
      
      template: _.template(template),

      initialize(options) {
          options.vent.bind("updatedStatus", this.updatedStatus, this);
          options.vent.bind("selectedCyclist", this.selectedCyclist, this);
          options.vent.bind("setupAudio", this.setupMusic, this);
          
          
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

      updatedStatus: function(status) {
        var maxMeters = this.model.get("maxMeters");

        if (this.viewport != null) {
          this.viewport.updateViewport(this.model, maxMeters);
        }
      },

      selectedCyclist: function(number) {
        if (this.viewport != null) {
          this.viewport.setPreselectedNumber(number);
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

        var sketchHolder = new p5(sketch);

        this.viewport = new ViewportManager(sketchHolder, this.features);

      }
    });

    return ArenaView;
  });