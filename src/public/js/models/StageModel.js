define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var StageModel = Backbone.Model.extend({

        initialize(options) {
            this.vent = options.vent;
        },

        initStage: function (data) {
            this.set("cyclists", data.cyclists);
            this.set("cyclists_index", data.cyclists_index);
            this.set("profile", data.profile);
            this.set("teams", data.teams);
            this.set("myTeam", data.teams[data.myTeam]);
            this.set("clock", 0);

            this.vent.trigger("createStage", data);
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
            });

            var list = cyclists.slice(0)
            list.sort((a,b)=>{
              return b.position.x - a.position.x;
            });

            this.set("sortedCyclists", list);
            this.set("maxMeters", list[0].position.x);

            return list;
        },

        updateGroups: function (groups) {
            this.set("groups", groups);
        },

        updateTimestamp: function (timestamp) {
            this.set("clock", timestamp);
        }

    });

    return StageModel;
});