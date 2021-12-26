define([
    'jquery',
    'underscore',
    'backbone'
  ], function($, _, Backbone){
    return {
      _url: 'https://xantest.herokuapp.com/',
      url: location.protocol + '//' + location.host +'/'
    };
  });