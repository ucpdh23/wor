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
        this.vent = options.vent;

        this.firstTime = true;
      },
      

      loadTeam: function() {
        this.myTeam = this.model.get("myTeam");

        this.render();
      },



      render: function(){
        if (this.firstTime) {

          if (this.myTeam == undefined) return;
          
          this.el.innerHTML = "";

          for (var member of this.myTeam.cyclists) {
            var childView = new TeamMemberView({vent: this.vent, model: member});
            this.el.append(childView.el);
          }

          this.firstTime = false;
        }
      }
    });

    return TeamView;
  });