define([], function () {
    const cyclistClass = function (p5, features, cyclist, meters, context) {
        this.p5 = p5;
        this.features = features;
        this.meters = meters;

        this.reference = meters + features.reference;

        this.posX = (this.reference - cyclist.position.x) * 10 * this.features.scale
        this.posY = this.features.middle + cyclist.position.y * 10 * this.features.scale

        this.colliding = false;
        this.number = cyclist.number;
        this.name = cyclist.name;
        //this.starts = Object.keys(cyclist) ; //(cyclist.energy.llano + cyclist.energy.montana + cyclist.energy.sprint + cyclist.energy.bajada) / 4 * 5 / 100;

        this.visualConditions = context.computeVisualConditions(cyclist, this);


        this.draw = function (p5) {
            const posX = this.posX;
            const posY = this.posY;

            p5.stroke(255);

            p5.line(posX, posY, posX + 18 * this.features.scale, posY);


            if (this.colliding) p5.stroke(255, 0, 0)
            else if (this.number % 10 == 1) p5.stroke(0, 255, 0);

            p5.ellipse(posX + 6 * this.features.scale, posY + this.visualConditions.heading, 4 * this.features.scale, 4 * this.features.scale);

            p5.triangle(
                posX + 9 * this.features.scale, posY - 3 * this.features.scale + this.visualConditions.heading * this.features.scale,
                posX + 9 * this.features.scale, posY + 3 * this.features.scale + this.visualConditions.heading * this.features.scale,
                posX + 15 * this.features.scale, posY);


            this.drawMallot(p5, posX, posY, this.visualConditions.heading);

            p5.ellipse(posX + 14 * this.features.scale, posY - 2 * this.features.scale, (this.visualConditions.sequence % 4) * this.features.scale, 1 * this.features.scale);
            p5.ellipse(posX + 14 * this.features.scale, posY + 2 * this.features.scale, ((this.visualConditions.sequence + 2) % 4) * this.features.scale, 1 * this.features.scale);
    
            p5.stroke(255);
  
        };

        this.triangleMallot = function (p5, posX, posY, heading) {
            p5.triangle(
                posX + 9 * this.features.scale, posY - 3 * this.features.scale + heading,
                posX + 9 * this.features.scale, posY + 3 * this.features.scale + heading,
                posX + 15 * this.features.scale, posY);
        };


        this.drawMallot = function (p5, posX, posY, heading) {
            if (this.number < 10) {
                p5.stroke(218, 165, 32)
                p5.fill(218, 165, 32);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()
                //stroke(0);
                //line(posX + 9, posY - 3+ heading,
                //posX + 9, posY - 1+ heading
                //);

            } else if (this.number < 20) {

                p5.stroke(0, 191, 225)
                p5.fill(0, 191, 225);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

            } else if (this.number < 30) {

                p5.stroke(255, 255, 255)
                p5.fill(255, 255, 255);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                p5.stroke(0, 255, 0)
                p5.fill(0, 255, 0)
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

            } else if (this.number < 40) {

                p5.stroke(255, 0, 0)
                p5.fill(255, 0, 0);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                p5.stroke(0, 0, 0)
                p5.fill(0, 0, 0)
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

            } else if (this.number < 50) {

                p5.stroke(0, 0, 228)
                p5.fill(0, 0, 228);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                p5.stroke(255)
                p5.fill(255)
                p5.triangle(
                    posX + 11, posY - 1 + heading,
                    posX + 11, posY + 1 + heading,
                    posX + 11, posY);
                p5.noFill()

            } else if (this.number < 60) {

                p5.stroke(255, 0, 0)
                p5.fill(255, 0, 0);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                p5.stroke(250)
                p5.fill(250)
                p5.triangle(
                    posX + 11, posY - 2 + heading,
                    posX + 11, posY + 2 + heading,
                    posX + 15, posY);
                p5.noFill()

            } else if (this.number < 70) {

                p5.stroke(00, 171, 132)
                p5.fill(00, 171, 132);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                /*  stroke (250)
                  fill(250)
                  triangle(
                   posX + 11, posY - 2+ heading,
                   posX + 11, posY + 2+ heading,
                   posX + 15, posY);*/

            } else if (this.number < 80) {

                p5.stroke(87, 35, 100)
                p5.fill(87, 35, 100);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                /* stroke (250)
                 fill(250)
                 triangle(
                  posX + 11, posY - 2+ heading,
                  posX + 11, posY + 2+ heading,
                  posX + 15, posY);*/
                p5.noFill()

            } else if (this.number < 90) {

                p5.stroke(255, 255, 0)
                p5.fill(255, 255, 0);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                p5.stroke(150)
                p5.fill(150)
                p5.triangle(
                    posX + 11, posY - 2 + heading,
                    posX + 11, posY + 2 + heading,
                    posX + 15, posY);
                p5.noFill()

            } else if (this.number < 100) {

                p5.stroke(255, 255, 255)
                p5.fill(255, 255, 255);
                this.triangleMallot(p5, posX, posY, heading);
                p5.noFill()

                p5.stroke(0, 0, 255)
                p5.fill(0, 0, 255);
                p5.triangle(
                    posX + 11, posY - 2 + heading,
                    posX + 11, posY + 2 + heading,
                    posX + 15, posY);
                p5.noFill()

            }
        }


    };

    return cyclistClass;
});
