define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/teamMemberActions.html',
    'services/UtilsService',
    'services/StageService'
  ], function($, _, Backbone, template, UtilsService, StageService){
    var TeamMemberActionsView = Backbone.View.extend({

      events: {
        "click .action-operation": "runOperation"
      },
      
      template: _.template( template),

      initialize(options) {
        this.model = options.model;
        this.vent = options.vent;

        this.vent.bind("updatedActions_" + this.model.number, this.render, this);

      },

      render: function(){
        var operations = [];
        if (this.model.operations !== undefined && this.model.operations !== null)
          operations = this.model.operations;

        var data = {
          operations: operations,
        };

        this.$el.html( this.template(data) );

        return this;
      },
      
      runOperation: function(ev) {
        //console.log('operation' + $(ev.target).attr('action'));
        //console.log('id:'+this.model.id);
        StageService.runOperation(
          this.model.id,
          $(ev.target).attr('action'));
      },

    });

    return TeamMemberActionsView;
  });