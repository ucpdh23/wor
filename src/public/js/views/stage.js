define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/stage.html',
  'text!templates/stage_mobile.html',
  /*'p5',
  'p5_sound',*/
  'services/StageService',
  'models/StageModel',
  'views/arena',
  'views/profile',
  'views/clock',
  'views/team',
  'views/groups',
  'views/contextMenu',
  'constants'
], function ($, _, Backbone, stageTemplate, stageMobileTemplate, /*p5, p5Sound, */ StageService, StageModel, ArenaView, ProfileView, ClockView, TeamView, GroupsView, ContextMenuView, Constants) {

  var globalVent = _.extend({}, Backbone.Events);

  var stageModel = new StageModel({vent: globalVent});

  var StageView = Backbone.View.extend({

    el: $('#container'),

    model: stageModel,

    events: {
    },

    initialize() {
      this.vent = globalVent;

      this.mobile = false;
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        this.mobile = true;
       }

      StageService.initStage(output => {
        this.loadStageData(output);
        this.createWS();
      })
    },

    loadStageData: function (output) {
      this.model.initStage(output);
    },

    createWS: function () {
      //let HOST = location.origin.replace(/^http/, 'ws')
      let HOST = Constants.url.replace(/^http/, 'ws')
      let ws = new WebSocket(HOST);

      let that = this;

      ws.onmessage = (event) => {
        var status = JSON.parse(event.data)

        that.model.updateStatus(status);
      };
    },

    renderMobile: function(data) {
      var compiledTemplate = _.template(stageMobileTemplate, data);
      this.$el.html(compiledTemplate);

      var arena = new ArenaView({ el: $('#arena'), vent: this.vent, model: this.model });
      arena.render();

      var clock = new ClockView({ el: $('#clock'), vent: this.vent, model: this.model});
      clock.render();
      
      var groups = new GroupsView({ el: $('#groups'), vent: this.vent, model: this.model});
      groups.render();
      
      var contextMenu = new ContextMenuView({ el: $('#contextMenu'), vent: this.vent, model: this.model});
      contextMenu.render();

      var team = new TeamView({ el: $('#team'), vent: this.vent, model: this.model});
      team.render();
      
      var profile = new ProfileView({ el: $('#profile'), vent: this.vent, model: this.model});
      profile.render();
    },

    renderDesktop: function(data) {
      var compiledTemplate = _.template(stageTemplate, data);
      this.$el.html(compiledTemplate);

      var arena = new ArenaView({ el: $('#arena'), vent: this.vent, model: this.model });
      arena.render();

      var profile = new ProfileView({ el: $('#profile'), vent: this.vent, model: this.model});
      profile.render();

      var clock = new ClockView({ el: $('#clock'), vent: this.vent, model: this.model});
      clock.render();

      var groups = new GroupsView({ el: $('#groups'), vent: this.vent, model: this.model});
      groups.render();

      var team = new TeamView({ el: $('#team'), vent: this.vent, model: this.model});
      team.render();
    },

    render: function () {
      var data = {};

      if (this.mobile) {
        this.renderMobile(data);
      } else {
        this.renderDesktop(data);
      }
    },

  });

  return StageView;
});