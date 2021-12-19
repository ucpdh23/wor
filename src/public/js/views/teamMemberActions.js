define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/teamMemberActions.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var TeamMemberActionsView = Backbone.View.extend({

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

    });

    return TeamMemberActionsView;
  });