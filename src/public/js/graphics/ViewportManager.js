define([
    'graphics/road',
    'graphics/cyclist'
], function (Road, Cyclist) {
    const Context = function() {
        this.cyclists = {};

        this.computeHeading = function(cyclist, sequence) {
            var heading = 0;
            if (cyclist.acceleration.x > 0.1 /* || (this.energy.r_pend > 20 && this.acceleration.x > 0)*/) {
              if (sequence < 2)
                heading = -1;
              else if (sequence < 4)
                heading = 0;
              else if (sequence < 6)
                heading = 1;
              else
                heading = 0;
            }

            return heading;
        }

        this.computeVisualConditions = function(cyclist) {
            var cyclistContext = this.cyclists[cyclist.id];

            if (cyclistContext === undefined) {
                cyclistContext = {
                    heading: 0,
                    sequence: 0,
                }

                this.cyclists[cyclist.id] = cyclistContext;
            } else {
                cyclistContext.sequence = cyclistContext.sequence + 1;
            }

            cyclistContext.heading = this.computeHeading(cyclist, cyclistContext.sequence);

            return cyclistContext;
        }
    }

    const ViewportManager = function(p5, features) {
        this.p5 = p5;
        this.features = features;
        this.road = new Road(p5, this.features);

        this.items = [];
        this.context = new Context();


        this.updateViewport = function(model, meters) {
            this.road.update(meters, {slope : 0, width: 8});

            var items = [this.road];

            
            var cyclists = model.get("sortedCyclists");

            for (var cyclist of cyclists) {
                if (cyclist.position.x <= meters) {
                    if (cyclist.position.x < meters - this.features.maxSizeViewPort) {
                        break;
                    }

                    items.push(new Cyclist(this.p5, this.features, cyclist, meters, this.context));
                }
            }


            this.items = items;
        };

        this.draw = function(p5) {
            for (var item of this.items) {
                item.draw(p5);
            }
        };
    };

    return ViewportManager;
});