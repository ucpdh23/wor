define([
    'jquery',
    'underscore',
    'backbone',
    'views/stage',
    'views/welcome'
  ], function($, _, Backbone, GameView, WelcomeView){
    var AppRouter = Backbone.Router.extend({
      routes: {
        // Algunas urls de ejemplo
        '/welcome': 'welcome',
        '/game': 'showGame',
        // Default
        '': 'defaultAction'
      },

      welcome:function(){
        // creates a new object of View_1 to display it's message
        var view = new WelcomeView();
        view.render();
      },
      showGame:function(){
        // creates a new object of View_2 to display it's message
        var view = new GameView();
        view.render();
      },
      defaultAction:function(){
        // creates a new object of View_3 to display it's message        
        var view = new GameView();
        view.render();
      }
    });
  
    var initialize = function(){
        var app_router = new AppRouter;
        Backbone.history.start();
    };
    

    return {
      initialize: initialize
    };
  });