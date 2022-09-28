define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var StageModel = Backbone.Model.extend({

        initialize(options) {
            this.vent = options.vent;
            this.vent.bind("updateSetup", this.setup, this);
        },

        initStage: function (data) {
            this.set("cyclists", data.cyclists);
            this.set("cyclists_index", data.cyclists_index);
            this.set("cyclists_by_number", data.index_by_number);
            this.set("profile", data.profile);
            this.set("teams", data.teams);
            this.set("myTeam", data.teams[data.myTeam]);
            this.set("clock", 0);
            this.set("setup", {
              audio: true
            });
            
            console.log('loaded data');

            this.vent.trigger("createStage", data);
        },
        
    
        setup: function(property) {
          console.log(property);
          var value = property.value;
          var config = this.get("setup");
          if (property.key == 'audio') {
            var prev = config.audio;
            if (prev != value) {
              console.log('fgh');
              config.audio = value;
              this.set('setup',config);
              this.vent.trigger("setupAudio", value);
            }
            
          }
        },

        updateStatus: function (status) {
            this.updateCyclists(status.cyclists);
            this.updateGroups(status.groups);
            this.updateTimestamp(status.timestamp);

            this.vent.trigger("updatedStatus", status);
        },

        updateCyclists: function (cyclists) {
            var cyclists_index = this.get("cyclists_index");

            if (cyclists_index === undefined) return;

            cyclists.forEach(it => {
                cyclists_index[it.id].position.x = it.position.x;
                cyclists_index[it.id].position.y = it.position.y;
                cyclists_index[it.id].velocity.x = it.velocity.x;
                cyclists_index[it.id].velocity.y = it.velocity.y;
                cyclists_index[it.id].pulse = it.pulse;
            });

            var list = cyclists.slice(0)
            list.sort((a,b)=>{
              return b.position.x - a.position.x;
            });

            this.set("sortedCyclists", list);
            this.set("maxMeters", list[0].position.x);

            return list;
        },
        
        getByNumber: function(number) {
          return this.get("cyclists_by_number")[number];
        },

        updateGroups: function (groups) {
            this.set("groups", groups);
            var indexOfGroupsByCyclist = {};
            for (group in groups) {
              for (cyclist in group.cyclists) {
                indexOfGroupsByCyclist[cyclist.number] = geoup.id
              }
            }
            
            this.set("groupsByCyclist", indexOfGroupsByCyclist);
            
        },

        updateTimestamp: function (timestamp) {
            this.set("clock", timestamp);
        }

    });

    return StageModel;
});