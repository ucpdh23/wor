define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/groups.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var GroupsView = Backbone.View.extend({

      template: _.template(template),

      initialize(options) {
        options.vent.bind("updatedStatus", this.render, this);
        this.vent = options.vent;
      },
      
      events: {
        'click .groups' : 'selectCyclist'
      },

      render: function(){
        var groups = this.model.get("groups");

        if (groups === undefined) return;

        if (groups.length == 1) {
          //this.el.innerHTML = "Peloton Agrupado";

          var data = {
            groups: this.composeGroups(groups)
          };
  
          this.$el.html( this.template(data) );
        } else {
          var data = {
            groups: this.composeGroups(groups)
          };
  
          this.$el.html( this.template(data) );
        }


      },

      composeGroups: function(groups) {
        let output = [];

        if (groups.length == 1) {
          output.push({
            type: 'group',
            label: 'Peloton Agrupado (' + groups[0].size + ')'
          })
        } else {
          var first = true;
          for (const group of groups) {
            output.push({
              type: (group.size == 1)? 'bicycle' : 'group',
              label: (first)? 'Tete de la Course' : 'Grupo perseguidor (' + group.name + ')',
              dist: (!first)? UtilsService.padAndRound(group.gap,0,2) : 0
            });

            first = false;
          }
        }
    
        return output;
      },

      selectCyclist: function(item) {
        console.log(item);
        //this.vent.trigger("selectedCyclist", this.model.number);
      }

    }
    
    );

    

    return GroupsView;
  });