require.config({
    shim: {
        underscore: {
          exports: '_'
        },
        backbone: {
          deps: ['underscore', 'jquery'],
          exports: 'Backbone'
        }/*,
        p5: {
          exports: 'p5',
          init: function (p5) {
            return this.p5 = p5;
          }
        },
        p5_sound: {
          deps: ['p5'],
          init: function (p5) {
            return this;
          }
        }*/
    },
    paths: {
      jquery: "//ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min",
      underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
      backbone: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min",
      text: "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
      d3: "//d3js.org/d3.v4.min",
      //p5: "//cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min",
      //p5_sound: "//cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min",
      templates: '../templates'
    }
  });
  
  require([
    'app',
  ], function(App){
    // The "app" dependency is passed in as "App"
    App.initialize();
  });