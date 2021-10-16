define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/teamMember.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var TeamMemberView = Backbone.View.extend({
      tagName: "div",
      className: "teamMember",

      events: {
        'click .teamMember-member' : 'selectCyclist'
      },

      initialize(options) {
        options.vent.bind("updatedStatus", this.render, this);
        this.model = options.model;

      },

      render: function(){
        var data = {
          number: this.model.number,
          position: parseInt(this.model.position.x) / 1000,
          velocity: parseInt(this.model.velocity.x * 3600 / 1000)
        };
        var compiledTemplate = _.template( template, data);
        this.$el.html( compiledTemplate );
      },

      selectCyclist: function() {
        console.log("selected:" + this.model.number)
      },


    });

    return TeamMemberView;
  });