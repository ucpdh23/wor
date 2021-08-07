define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/welcome.html'
  ], function($, _, Backbone, welcomeTemplate){
    var WelcomeView = Backbone.View.extend({
      el: $('#container'),

      render: function(){
        var data = {};
        var compiledTemplate = _.template( welcomeTemplate, data );
        this.$el.html( compiledTemplate );
      }
    });

    return WelcomeView;
  });