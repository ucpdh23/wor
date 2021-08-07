define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/clock.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var ClockView = Backbone.View.extend({

      initialize(options) {
          options.vent.bind("updatedStatus", this.render, this);
      },

      render: function(){
        var timestamp = this.model.get("clock");
        var data = {
          clock: UtilsService.timestampToString(timestamp)
        };

        var compiledTemplate = _.template( template, data);
        this.$el.html( compiledTemplate );

      }
    });

    return ClockView;
  });