define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/arena.html',
    'graphics/ViewportManager'
  ], function($, _, Backbone, template, ViewportManager){
    var ArenaView = Backbone.View.extend({

      initialize(options) {
          options.vent.bind("updatedStatus", this.updatedStatus, this);
          this.viewport = null;
          this.features = {
            canvasWidth: $( window ).width(),
            canvasHeight: $( window ).height() * 0.6,
            backgroundColor: 40,
            maxSizeViewPort: 100,
            reference: 10 * 1.5,
            scale: ($( window ).height() > 300)? 1.8 : 1.1,
          };
      },

      updatedStatus: function(status) {
        var maxMeters = this.model.get("maxMeters");

        if (this.viewport != null) {
          this.viewport.updateViewport(this.model, maxMeters);
        }
      },

      render: function(){
        var data = {};

        var compiledTemplate = _.template( template, data );
        this.$el.html( compiledTemplate );

        let sketch = p => {
            p.setup = () => {
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