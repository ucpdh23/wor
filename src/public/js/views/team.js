define([
    'jquery',
    'underscore',
    'backbone',
    'services/UtilsService',
    'views/teamMember'
  ], function($, _, Backbone, UtilsService, TeamMemberView){
    var TeamView = Backbone.View.extend({

      initialize(options) {
        options.vent.bind("createStage", this.loadTeam, this);
        //options.vent.bind("updatedStatus", this.render, this);
        this.vent = options.vent;
      },
      

      loadTeam: function() {
        this.myTeam = this.model.get("myTeam");
        console.log(this.myTeam);

        this.render();
      },

      render: function(){
        //var compiledTemplate = _.template( template, data);
        this.el.innerHTML = "";

        for (var member of this.myTeam.cyclists) {
            var childView = new TeamMemberView({vent: this.vent, model: member});
            this.el.append(childView.el);
        }
      }
    });

    return TeamView;
  });