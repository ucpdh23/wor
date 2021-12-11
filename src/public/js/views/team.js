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
        options.vent.bind("selectedCyclist", this.selectItem, this);
        this.vent = options.vent;

        this.firstTime = true;
        this.selected = null;
      },
      

      loadTeam: function() {
        this.myTeam = this.model.get("myTeam");

        this.render();
      },

      selectItem: function(number) {
        if (this.selected == null) {
          this.selected = number;
          $('#teamMember_' + number).parent().toggleClass("teamMember-selected");
        } else if (this.selected === number) {
          $('#teamMember_' + number).parent().toggleClass("teamMember-selected");
          this.selected = null;
        } else {
          $('#teamMember_' + this.selected).parent().toggleClass("teamMember-selected");
          $('#teamMember_' + number).parent().toggleClass("teamMember-selected");
          this.selected = number;
        }
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