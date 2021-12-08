define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/teamMember.html',
    'services/UtilsService',
    'views/teamMemberData',
  ], function($, _, Backbone, template, UtilsService, TeamMemberDataView){
    var TeamMemberView = Backbone.View.extend({
      tagName: "div",
      className: "teamMember",

      template: _.template( template),

      events: {
        'click .teamMember' : 'selectCyclist'
      },

      initialize(options) {
        options.vent.bind("updatedStatus", this.render, this);
        this.model = options.model;
        this.vent = options.vent;

        var data = {
          number: this.model.number,
          position: parseInt(this.model.position.x) / 1000,
          velocity: parseInt(this.model.velocity.x * 3600 / 1000)
        };

        this.firstTime = true;
      },

      render: function(){
        if (this.firstTime) {
          var data = {
            number: this.model.number,
            position: parseInt(this.model.position.x) / 1000,
            velocity: parseInt(this.model.velocity.x * 3600 / 1000)
          };
  
          this.$el.html( this.template(data) );
  
          var teamMemberData = new TeamMemberDataView({ el: $('#teamMemberData_' + data.number), vent: this.vent, model: this.model });
          teamMemberData.render();

          this.firstTime = false;
        }


        return this;
      },

      selectCyclist: function() {
        this.vent.trigger("selectedCyclist", this.model.number);
      },

    });

    return TeamMemberView;
  });