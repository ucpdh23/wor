define([], function () {
    const selectedCyclistClass = function (p5, features, cyclist, context) {
        this.p5 = p5;
        this.features = features;

        this.posX = cyclist.posX
        this.posY = cyclist.posY

        this.number = cyclist.number;
        this.name = cyclist.name;
        this.starts = cyclist.starts;
        this.step = 5
        this.secuence = 0

        this.update = function (step) {
            if (step < 0 && this.step > 0) {
                this.step = this.step -1;
            } else if (step > 0) {
                this.secuence++;
            }
        };


        this.draw = function (p5) {
            const posX = this.posX + 17;
            const posY = this.posY;

            p5.circle(posX , posY, 40);

            if (this.secuence >= 10) {
                p5.line(posX + 5, posY - 12, posX + 25, posY - 60)
            }

            if (this.secuence >= 20) {
                p5.rect(posX + 25, posY - 105, 90, 45);
            }

            if (this.secuence >= 25) {
                p5.textSize(14);
                p5.text("" + this.number, posX + 28, posY - 85)
                p5.textSize(12);
                p5.textStyle(p5.NORMAL);
                p5.text("" + this.name, posX + 28, posY - 73)
            }
  
        };


    };

    return selectedCyclistClass;
});
