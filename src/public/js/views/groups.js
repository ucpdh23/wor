define([
    'jquery',
    'underscore',
    'backbone'
  ], function($, _, Backbone){
    var GroupsView = Backbone.View.extend({

      initialize(options) {
        options.vent.bind("updatedStatus", this.render, this);
        this.vent = options.vent;
      },
      

      render: function(){
        var groups = this.model.get("groups");

        if (groups === undefined) return;

        if (groups.length == 1) {
          this.el.innerHTML = "Peloton Agrupado";
        } else {
          this.el.innerHTML = "groups:" + groups.length;
        }


      }
    });

    return GroupsView;
  });