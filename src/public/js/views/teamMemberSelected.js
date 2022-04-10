define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/teamMemberSelected.html',
    'services/UtilsService',
    'services/StageService',
    'views/teamMemberActions',
  ], function($, _, Backbone, template, UtilsService, StageService, TeamMemberActionsView){
    var TeamMemberSelectedView = Backbone.View.extend({

      events: {
        "click .action-operation": "runOperation"
      },
      
      template: _.template( template),

      initialize(options) {
        this.model = options.model;
        this.vent = options.vent;

        this.vent.bind("teamMemberSelected", this.selected, this);
      },
      
      selected: function(item) {
        console.log('selected')
        console.log(item)
        
        if (item == null) {
          $('.teamMemberSelected').removeClass("teamMemberSelectedVisible");
        } else {
          this.model = item;
          $('.teamMemberSelected').addClass("teamMemberSelectedVisible");
          
          this.render();
        }
      },

      render: function(){
        var llano = '-';
        var montana = '-';
        var bajada = '-';
        var estadoForma = '-';
        var sprint = '-';
        var name = '-';
        if (this.model) {
          if (this.model.energy) {
            llano = parseInt(this.model.energy.llano);
            montana = parseInt(this.model.energy.montana);
            estadoForma = parseInt(this.model.energy.estadoForma);
            bajada = parseInt(this.model.energy.bajada);
            sprint = parseInt(this.model.energy.sprint);
          }
          number = this.model.number;
          name = this.model.name;
        }
        
        
        var data = {
          number: number,
          name: name,
          llano: llano,
          montana: montana,
          bajada: bajada,
          sprint: sprint,
          estadoForma: estadoForma,
        };

        this.$el.html( this.template(data) );

        var teamMemberSelectedActions = new TeamMemberActionsView({ el: $('#teamMemberActions'), vent: this.vent, model: this.model });
        teamMemberSelectedActions.render();

        return this;
      },
      
      runOperation: function(ev) {
        StageService.runOperation(
          this.model.id,
          $(ev.target).attr('action'));
      },

    });

    return TeamMemberSelectedView;
  });