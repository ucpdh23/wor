define([
    'jquery',
    'underscore',
    'backbone',
    'services/UtilsService',
    'services/StageService',
    'views/teamMember',
    'views/teamMemberSelected'
  ], function($, _, Backbone, UtilsService, StageService, TeamMemberView, TeamMemberSelectedView){
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

        this.i_cyclists_number = {};

        for (var member of this.myTeam.cyclists) {
          this.i_cyclists_number[member.number] = member;
        }

        this.render();
      },



      selectItem: function(number) {

        if (this.selected == null) {
          this.selected = number;
          // $('#teamMember_' + number).parent().toggleClass("teamMember-selected");
        } else if (this.selected === number) {
          $('#teamMember_' + number).parent().toggleClass("teamMember-selected");
          this.selected = null;
        } else {
          $('#teamMember_' + this.selected).parent().toggleClass("teamMember-selected");
          //$('#teamMember_' + number).parent().toggleClass("teamMember-selected");
          this.selected = number;
        }

        if (this.selected != null) {
          let cyclist = this.i_cyclists_number[this.selected];
          StageService.getCyclist(cyclist.id, data => {
            cyclist.operations = data.operations;
            $('#teamMember_' + this.selected).parent().toggleClass("teamMember-selected");
            this.vent.trigger("updatedActions_" + this.selected, cyclist);
            this.vent.trigger("teamMemberSelected", cyclist)
          });
        } else {
          this.vent.trigger("teamMemberSelected", null);
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
          
          var selected = new TeamMemberSelectedView({ el: $('#teamMemberSelectedID'), vent: this.vent, model: this.model});
          selected.render();

          this.firstTime = false;
        }
      }
    });

    return TeamView;
  });