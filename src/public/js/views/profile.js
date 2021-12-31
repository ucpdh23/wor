define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'text!templates/profile.html',
  'services/UtilsService'
], function ($, _, Backbone, d3, template, UtilsService) {
  var ProfileView = Backbone.View.extend({

    el: $('#container'),

    initialize(options) {
      options.vent.bind("createStage", this.drawProfile2, this);
      options.vent.bind("updatedStatus", this.update, this);
    },

    render: function () {
      var data = {};

      var compiledTemplate = _.template(template, data);
      this.$el.html(compiledTemplate);
    },

    drawProfile2: function() {
      var profileData = this.model.get("profile");

      var accMin = 0;
      var accMax = 0;

      let elevGain = profileData.data.reduce((acc, cur, idx, arr) => {
        if (idx > 0 && (cur.y > arr[idx - 1].y)) {
          acc += cur.y - arr[idx - 1].y;

          accMin = Math.min(accMin, acc);
          accMax = Math.max(accMax, acc);
        }

        return acc;
      }, 0);

      console.log("accMin:" + accMin)
      console.log("accMax:" + accMax)
      console.log("elevGain:" + elevGain)
      
      

      let canvas = document.getElementById("profileCanvas");
      this.resizeCanvasToDisplaySize(canvas);
      let canvas2 = document.getElementById("profileCanvasTokens");
      this.resizeCanvasToDisplaySize(canvas2);

      let cx = canvas.getContext("2d");

      cx.font = "10px Orbitron";

      let canvasWidth = canvas.width; //$('#profileCanvas').width();
      let canvasHeight = canvas.height; //$('#profileCanvas').height();

      let centerX = canvasWidth / 2;
      let centerY = canvasHeight / 2;

      let margenX = 10;
      let margenBottom = 10;

      var kms = profileData.data.length;
      this.scaleX = (canvasWidth - margenX*2) / kms;
      let scaleX = this.scaleX;
      this.scaleY = (canvasHeight - margenBottom) / (accMax - accMin) ;
      let scaleY = this.scaleY;

      this.startX = margenX;
      let startX = this.startX;
      this.startY = canvasHeight - margenBottom - accMin - 10;
      let startY = this.startY;


      cx.strokeStyle = "#FF0000";
      cx.fillStyle = "blanchedalmond";

      this.drawRuler(cx, scaleX, scaleY, startX, startY + 3, profileData.data);

      // base line

      //cx.arc(centerX, centerY, Math.min(centerX, centerY), 0, 2 * Math.PI, false);

      cx.fillText("kms:" + kms, startX, 20);

      this.drawLine(cx, scaleX, scaleY, startX, startY, profileData.data);

      this.drawPortInfo(cx, scaleX, scaleY, startX, startY, profileData, canvasWidth);

    },
    
    drawToken: function(id) {
      var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
      newLine.setAttribute('id','token_'+id);
      newLine.setAttribute('x1','50');
      newLine.setAttribute('y1','50');
      newLine.setAttribute('x2','200');
      newLine.setAttribute('y2','200');
      newLine.setAttribute("stroke", "white")
      return newLine;
    },

    drawRuler: function(cx, scaleX, scaleY, startX, startY, data) {
      cx.strokeRect(startX, startY, data.length * scaleX, -1);

      cx.font = "9px Orbitron";

      for (var i =0; i <= data.length; i++) {
        var cota = 2;
        if (i%5 == 0) {
          let ret = (i < 10)? 2 : 5;

          cx.strokeStyle = "#550000";
          cx.strokeRect(startX + scaleX * i, startY, 0, - startY + 40);

          cx.fillText("" + i, startX + scaleX * i - ret, startY + 10);
          cota = 3;
        }

        cx.strokeRect(startX + scaleX * i, startY, 1, cota);
      }
    },

    drawLine: function(cx, scaleX, scaleY, startX, startY, data) {
      cx.beginPath();
      cx.strokeStyle = "#FF0000";
      

      var x = startX;
      var y = startY
      cx.moveTo(x, y);

      for (i=0; i < data.length; i++) {
        x = x + scaleX;
        y = startY - data[i].y * scaleY

        cx.lineTo(x, y);
      }

      cx.lineTo(x, startY);


      cx.fill();

    },

    drawPortInfo: function(cx, scaleX, scaleY, startX, startY, profile, canvasWidth) {
      for (var portInfo of profile.portInfos) {
        cx.strokeRect(startX + portInfo.endKms * scaleX, startY, 1, -startY + 50);
        cx.fillStyle = "#AA0000";
        var textX = startX + portInfo.endKms * scaleX
        if (canvasWidth < textX + 20) {
          textX = textX - 35;
        }
        cx.fillRect(textX - 3, 50 + 7, 45, - 20);
        cx.fillStyle = "blanchedalmond";
        cx.fillText("%: " + UtilsService.padAndRound(portInfo.slopeAvg, 2, 1), textX, 50);
      }
    },



    resizeCanvasToDisplaySize: function(canvas) {
      // Lookup the size the browser is displaying the canvas in CSS pixels.
      const displayWidth  = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
     
      // Check if the canvas is not the same size.
      const needResize = canvas.width  !== displayWidth ||
                         canvas.height !== displayHeight;
     
      if (needResize) {
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
      }
     
      return needResize;
    },
    
    triangles: [],
    percentColorsProfile:[
      { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
      { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0 } },
      { pct: 0.75, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 1.0, color: { r: 0x00, g: 0x00, b: 0 } }],

    update: function () {
      var cyclists = this.model.get("myTeam").cyclists;
      var allCyclists = this.model.get("sortedCyclists");
      var etapa = this.model.get("profile").etapa;
      
      let canvas = document.getElementById("profileCanvasTokens");
      let cx = canvas.getContext("2d");
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
      
      cx.clearRect(0,0, canvasWidth, canvasHeight);
      
      let first = allCyclists[0].position.x;
      let firstPos = this.startX + first * this.scaleX/ 1000;
      cx.strokeStyle = '#ff0000';
      cx.strokeRect(firstPos, 50, 1, 250);

      for (var item of cyclists) {
        let position = this.startX + item.position.x * this.scaleX/ 1000;
        cx.beginPath();
        cx.moveTo(position, 50);
        cx.lineTo(position, 250);
        cx.strokeStyle = '#ffff00'
        cx.stroke();
        //cx.strokeRect(position, 50, 0, 250);
      }
    }
  });

  return ProfileView;
});