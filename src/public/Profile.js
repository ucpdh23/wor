class Profile {
    etapa = [0, 2, 4, 7, 2, -3, -5, -5, -3, 0, 0, 0, 0, 4, 5, 7, 8, 6, 7, 8, 9, 10, -3, -6, -6, -6, -7, -2, -5, -7, -9, -2, 0, 0, 0, 0, 0, 4, 0, 6, 7, 12, 15, 3];

    data = [];

    segment = 1000;

    portInfos = [];

    clasificacion;

    percentColorsProfile = [
        { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
        { pct: 0.5, color: { r: 0x00, g: 0xff, b: 0 } },
        { pct: 0.75, color: { r: 0xff, g: 0x00, b: 0 } },
        { pct: 1.0, color: { r: 0x00, g: 0x00, b: 0 } }];

    constructor(clasificacion, etapa) {
        var prevSlope = 0;
        var port = 0;

        var elevation = 0;
        var dist = 0;

        this.clasificacion = clasificacion;


        this.data.push(
            {
                x: dist,
                y: elevation
            }
        );

        var portInfo = null;
        for (var i = 0; i < etapa.length; i++) {
            var slope = this.etapa[i];
            dist += this.segment;
            elevation += slope * this.segment / 100;
            this.data.push({ x: dist, y: elevation })

            prevSlope = slope;
        }

    }

    drawProfile(profile) {

        let elevGain = this.data.reduce((acc, cur, idx, arr) => {
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

        const chartWidth = 200;
        const chartHeight = 100;
        const width = chartWidth - chartMargins.right - chartMargins.left;
        const height = chartHeight - chartMargins.top - chartMargins.bottom;

        const svg = d3.select('#idStage').append('svg')
            .attr('width', '100%') //chartWidth)
            .attr('height', '100%'); //chartHeight);
        //const svg = profile;
        this.svg = svg;

        const g = svg.append('g')
            .attr('transform', "translate(" + chartMargins.left + "," + chartMargins.top + ")");

        const xScale = d3.scaleLinear()
            .range([0, width])
            // .domain(d3.extent(data, d => d.x));
            .domain([0, this.etapa.length * this.segment])
        this.xScale = xScale;

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain(d3.extent(this.data, d => d.y));

        const areaFn = d3.area()
            .x(d => xScale(d.x))
            .y0(yScale(d3.min(this.data, d => d.y)))
            .y1(d => yScale(d.y))
            .curve(d3.curveBasis);

        g.append('path')
            .datum(this.data)
            //.attr('fill', 'steelblue')
            .attr('fill', 'red')
            .attr('d', areaFn);

        let xAxisGenerator = d3.axisBottom(xScale);

        xAxisGenerator.tickFormat(d3.format(".2s"));

        g.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxisGenerator)

    }

    setCyclists(cyclists) {
        this.cyclists = cyclists;
    }

    triangles = [];

    update(delta) {
        for (i = 0; i < 7 && i < this.cyclists.length; i++) {
            if (this.triangles[i] == null) {
                var sym =
                    d3.symbol().type(d3.symbolTriangle).size(25);
                this.triangles[i] = this.svg.append('path');
                this.triangles[i].attr("d", sym)
                    .attr("transform", function (d) { return "translate(" + 10 + "," + 10 + ")"; })
                    .style("fill", "#0000FF");
            } else {
                const value = 10 + this.xScale(this.cyclists[i].position.x);

                var index = (int)(this.cyclists[i].position.x / this.segment);
                var desn = this.etapa[index]

                this.triangles[i].attr("transform", function (d) {
                    return "translate(" +
                        // this.xScale(this.cyclists[i].position.x) 
                        value + "," + 100 + ")";
                });

                var percent = (desn + 30) / 60;
                var color = getColorForPercentage(
                    percent,
                    this.percentColorsProfile)
                var colorCode = '#' + rgbToHex(color.r) + rgbToHex(color.g) + rgbToHex(color.b);

                this.triangles[i].style("fill", colorCode);

            }

        }
    }


    computeSlope(position) {
        var index = (int)(position / this.segment);

        if (index < this.etapa.length) {
            return this.etapa[index];
        } else {
            return 0;
        }
    }

    computeEnvironmentByPos(pos) {
        var computeSlope=this.computeSlope(pos);
        
        var computeWidth = computeSlope == 0?
          8 : 4;
        
        return {
         slope: computeSlope,
         width: computeWidth
        };
      }

}