define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/groups.html',
    'services/UtilsService'
  ], function($, _, Backbone, template, UtilsService){
    var GroupsView = Backbone.View.extend({

      template: _.template(template),
      updatedTimestamp: null,

      initialize(options) {
        options.vent.bind("updatedStatus", this.render, this);
        this.vent = options.vent;
      },
      
      events: {
        'click .groups-item' : 'selectCyclist'
      },

      render: function(){
        var groups = this.model.get("groups");

        if (groups === undefined) return;
        
        if (this.updatedTimestamp != null && Date.now() - this.updatedTimestamp < 5000) return;
        console.log("updating groups...")
        this.updatedTimestamp = Date.now();

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
        
        var index= 0;

        if (groups.length == 1) {
          output.push({
            type: 'group',
            label: 'Peloton Agrupado (' + groups[0].size + ')'
          })
        } else {
          var first = true;
          
          for (const group of groups) {
            output.push({
              index: index++,
              type: (group.size == 1)? 'bicycle' : 'group',
              label: (first)? 'Tete de la Course' : 'Grupo perseguidor (' + group.name + ')',
              dist: (!first)? UtilsService.padAndRound(group.gap,0,2) : 0,
              firstCyclist: group.firstCyclistNumber
            });

            first = false;
          }
        }
        /*for (var i=0;i<7;i++)
        output.push({
            index: index++,
            type: 'group',
            label: 'Test',
            dist: 8,
            firstCyclistNumber: 33
          })*/
        
    
        return output;
      },

      selectCyclist: function(e) {
        //console.log(item);
        e.preventDefault();
        var data = $(e.currentTarget).attr("data");
        
        this.vent.trigger("selectedCyclist", data);
      }

    }
    
    );

    

    return GroupsView;
  });