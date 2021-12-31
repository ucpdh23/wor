define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/teamMemberData.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var TeamMemberDataView = Backbone.View.extend({
      tagName: "div",
      className: "teamMemberData",

      template: _.template( template),

      initialize(options) {
        options.vent.bind("updatedStatus", this.render, this);
        this.model = options.model;
        this.vent = options.vent;

      },

      render: function(){
        
        let pos = parseInt(this.model.position.x) / 1000;
        let kms = Math.floor(pos);
        let meters = parseInt((pos - kms)*1000);

        var data = {
          number: this.model.number,
          kms: kms,
          meters: UtilsService.pad(meters, 3),
          position: parseInt(this.model.position.x) / 1000,
          velocity: parseInt(this.model.velocity.x * 3600 / 1000),
          pulse: parseInt(this.model.pulse)
        };

        this.$el.html( this.template(data) );

        return this;
      },

    });

    return TeamMemberDataView;
  });