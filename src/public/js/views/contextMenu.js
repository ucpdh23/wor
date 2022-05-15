define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/contextMenu.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var ContextMenuView = Backbone.View.extend({

      template: _.template(template),

      initialize(options) {
          // options.vent.bind("updatedStatus", this.render, this);
          this.vent = options.vent;
          this.vent.bind("setupAudio", this.render, this);
      },
      
      events: {
        'click .actuator' : 'updateConfig'
      },

      render: function(){
        var data = this.model.get("setup");
        console.log('render');
        console.log(data);
        
        if (data == undefined)
          data = {
            audio: true
          }

        this.$el.html( this.template(data) );
      },
      
      updateConfig: function(e) {
        var property = $(e.currentTarget).attr("property");
        var newValue = $(e.currentTarget).attr("value");
        const bValue = newValue.toLowerCase() === 'true';
        console.log(property + bValue);
        var event = '';
        var value = {};
        if (property == 'audio') {
          event = 'updateSetup';
          value = {
            key: 'audio',
            value: bValue};
        }
        if (event != '') 
          this.vent.trigger(event, value);
      }
    });

    return ContextMenuView;
  });