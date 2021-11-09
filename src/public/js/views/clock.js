define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/clock.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var ClockView = Backbone.View.extend({

      template: _.template(template),

      initialize(options) {
          options.vent.bind("updatedStatus", this.render, this);
      },

      render: function(){
        var timestamp = this.model.get("clock");
        var data = {
          clock: UtilsService.timestampToString(timestamp)
        };

        this.$el.html( this.template(data) );
      }
    });

    return ClockView;
  });