define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/stage.html',
  /*'p5',
  'p5_sound',*/
  'services/StageService',
  'models/StageModel',
  'views/arena',
  'views/profile',
  'views/clock'
], function ($, _, Backbone, stageTemplate, /*p5, p5Sound, */ StageService, StageModel, ArenaView, ProfileView, ClockView) {

  var globalVent = _.extend({}, Backbone.Events);

  var stageModel = new StageModel({vent: globalVent});

  var StageView = Backbone.View.extend({

    el: $('#container'),

    model: stageModel,

    initialize() {
      this.vent = globalVent;

      StageService.initStage(output => {
        this.loadStageData(output);
        this.createWS();
      })
    },

    loadStageData: function (output) {
      this.model.initStage(output);
    },

    createWS: function () {
      let HOST = location.origin.replace(/^http/, 'ws')
      let ws = new WebSocket(HOST);

      let that = this;

      ws.onmessage = (event) => {
        var status = JSON.parse(event.data)

        that.model.updateStatus(status);
      };
    },

    render: function () {
      var data = {};

      var compiledTemplate = _.template(stageTemplate, data);
      this.$el.html(compiledTemplate);

      var arena = new ArenaView({ el: $('#arena'), vent: this.vent, model: this.model });
      arena.render();

      var profile = new ProfileView({ el: $('#profile'), vent: this.vent, model: this.model});
      profile.render();

      var clock = new ClockView({ el: $('#clock'), vent: this.vent, model: this.model});
      clock.render();

    }
  });

  return StageView;
});