define([], function () {
    const roadClass = function (p5, features) {
        this.width = 8;
        this.slope = 0;
        this.p5 = p5;
        this.features = features;

        this.middle = this.features.canvasHeight / 2;
        this.features.middle = this.middle;

        this.computeLines = function() {
            var line = this.width * 10;

            this.y1 = this.middle - line * this.features.scale;
            this.y2 = this.middle + line * this.features.scale;

        }

        this.computeLines();

        this.update = function (meters, environment) {
            this.meters = meters;
            this.slope = environment.slope;
            this.width = environment.width;

            this.computeLines();
        };

        this.draw = function (p5) {
            p5.stroke(255);
            p5.fill(255)
            p5.textSize(13 * this.features.scale)
            p5.text("meters:" + parseInt(this.meters), 30 , 30 + this.features.scale*5)
            // text("speed:" + ((int)(globalFirst.velocity.x*3600))/1000, 30, 45)

            p5.line(0, this.y1, this.features.canvasWidth, this.y1);
            p5.line(0, this.y2, this.features.canvasWidth, this.y2);

            this.drawLines(p5, this.meters + this.features.reference);
            this.drawKmLine(p5, this.meters + this.features.reference);

            return this.meters + this.features.reference;
        };

        this.drawKmLine = function (p5, meters) {
            let previous = parseInt(meters / 100);
            let diff = meters - previous * 100;
            p5.line(diff * 10 * this.features.scale, this.y1, diff * 10 * this.features.scale, this.y2)
            p5.text("kms:" + previous / 10, diff * 10 * this.features.scale, this.y1 - 10)
        };

        this.drawLines = function (p5, meters) {
            var diff = (parseInt(meters * 10)) % 80;

            // start with white
            var start = diff - 120;

            for (var i = 0; i < 20; i++) {
                p5.line(start * this.features.scale, this.middle, (start + 40) * this.features.scale, this.middle);
                start += 80;
            }
        };

    };

    return roadClass;
});
