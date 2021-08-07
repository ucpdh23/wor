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
      //options.vent.bind("updatedStatus", this.update, this);
    },

    render: function () {
      var data = {};

      var compiledTemplate = _.template(template, data);
      this.$el.html(compiledTemplate);
    },

    drawProfile2: function() {
      var profileData = this.model.get("profile");

      let elevGain = profileData.data.reduce((acc, cur, idx, arr) => {
        if (idx > 0 && (cur.y > arr[idx - 1].y)) {
          acc += cur.y - arr[idx - 1].y;
        }
        return acc;
      }, 0);

      let canvas = document.getElementById("profileCanvas");
      this.resizeCanvasToDisplaySize(canvas);

      let cx = canvas.getContext("2d");

      let canvasWidth = canvas.width; //$('#profileCanvas').width();
      let canvasHeight = canvas.height; //$('#profileCanvas').height();

      let centerX = canvasWidth / 2;
      let centerY = canvasHeight / 2;

      let margenX = 10;
      let margenBottom = 10;

      var kms = profileData.data.length;
      let scaleX = (canvasWidth - margenX*2) / kms;

      cx.beginPath();
      cx.strokeRect(margenX, canvasHeight - margenBottom, canvasWidth - margenX*2, -5);

      for (var i =0; i <= kms; i++) {
        var cota = -10;
        if (i%5 == 0) {
          cx.fillText("" + i, margenX + scaleX * i, canvasHeight - margenBottom / 2);
          cota = -15;
        }

        cx.strokeRect(margenX + scaleX * i, canvasHeight - margenBottom, 1, cota);
      }


      // base line

      //cx.arc(centerX, centerY, Math.min(centerX, centerY), 0, 2 * Math.PI, false);
      cx.fillText("kms:" + kms, centerX, centerY);
      cx.fill();

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

    drawProfile: function () {
      var profileData = this.model.get("profile");

      let elevGain = profileData.data.reduce((acc, cur, idx, arr) => {
        if (idx > 0 && (cur.y > arr[idx - 1].y)) {
          acc += cur.y - arr[idx - 1].y;
        }
        return acc;
      }, 0);
      elevGain = Math.round(elevGain * 3.28084);

      const chartMargins = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      };

/*      
      const chartWidth = $( '#idStage' ).width();
      const chartHeight =  200; // $( '#idStage' ).height();

      console.log(chartWidth)
      console.log(chartHeight)
*/
      const chartWidth = 200;
      const chartHeight = 100;
      const width = chartWidth - chartMargins.right - chartMargins.left;
      const height = chartHeight - chartMargins.top - chartMargins.bottom;

      const svg = d3.select('#idStage').append('svg')
//        .attr('width', '100%') //chartWidth)
//        .attr('height', '100%')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 200 200")
        .classed("stage-top-profile-content", true); //chartHeight);
      //const svg = profile;
      this.svg = svg;

      const g = svg.append('g')
        .attr('transform', "translate(" + chartMargins.left + "," + chartMargins.top + ")");

      const xScale = d3.scaleLinear()
        .range([0, width])
        // .domain(d3.extent(data, d => d.x));
        .domain([0, profileData.data.length * 1000])
      this.xScale = xScale;

      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain(d3.extent(profileData.data, d => d.y));

      const areaFn = d3.area()
        .x(d => xScale(d.x))
        .y0(yScale(d3.min(profileData.data, d => d.y)))
        .y1(d => yScale(d.y))
        .curve(d3.curveBasis);

      g.append('path')
        .datum(profileData.data)
        //.attr('fill', 'steelblue')
        .attr('fill', '#A48434')
        .attr('d', areaFn);

      let xAxisGenerator = d3.axisBottom(xScale);

      xAxisGenerator.tickFormat(d3.format(".2s"));

      g.append('g')
        .attr("class", "stage-top-profile-content-axisWhite")
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisGenerator)

    },

    
    triangles: [],
    percentColorsProfile:[
      { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
      { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0 } },
      { pct: 0.75, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 1.0, color: { r: 0x00, g: 0x00, b: 0 } }],

    update: function () {
      var cyclists = this.model.get("cyclists");
      var etapa = this.model.get("profile").etapa;

      for (i = 0; i < 7 && i < cyclists.length; i++) {
        if (this.triangles[i] == null) {
          var sym =
            d3.symbol().type(d3.symbolTriangle).size(25);
          this.triangles[i] = this.svg.append('path');
          this.triangles[i].attr("d", sym)
            .attr("transform", function (d) { return "translate(" + 10 + "," + 10 + ")"; })
            .style("fill", "#AABBCC");
        } else {
          const value = 10 + this.xScale(cyclists[i].position.x);

          var index = parseInt(cyclists[i].position.x / this.segment);
          var desn = etapa[index]

          this.triangles[i].attr("transform", function (d) {
            return "translate(" +
              // this.xScale(this.cyclists[i].position.x) 
              value + "," + 100 + ")";
          });

          var percent = (desn + 30) / 60;
          var color = UtilsService.getColorForPercentage(
            percent,
            this.percentColorsProfile)
          var colorCode = '#' + UtilsService.rgbToHex(color.r) + UtilsService.rgbToHex(color.g) + UtilsService.rgbToHex(color.b);

          this.triangles[i].style("fill", colorCode);

        }

      }
    }
  });

  return ProfileView;
});