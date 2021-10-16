define([
    'graphics/road',
    'graphics/cyclist',
    'graphics/selectedCyclist'
], function (Road, Cyclist, SelectedCyclist) {
    const Context = function() {
        this.cyclists = {};

        this.selected = null;

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

        this.computeVisualConditions = function(cyclist, drawableCyclist) {
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
            
            var p5 = drawableCyclist.p5;

            if ((Math.abs(p5.mouseX - drawableCyclist.posX) < 5 || (p5.mouseX - drawableCyclist.posX > 0 && p5.mouseX - drawableCyclist.posX < 40) )
                && Math.abs(p5.mouseY - drawableCyclist.posY) < 10) {
                this.selected = drawableCyclist;
                //console.log("selected")
            }

            return cyclistContext;
        }
    }

    const ViewportManager = function(p5, features) {
        this.p5 = p5;
        this.features = features;
        this.road = new Road(p5, this.features);

        this.items = [];
        this.context = new Context();

        this.selectedItem = null;


        this.updateViewport = function(model, meters) {
            this.context.selected = null;

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

            if (this.context.selected != null) {
                if (this.selectedCyclist != null && this.selectedCyclist.number == this.context.selected.number) {
                    this.selectedCyclist.update(1);
                    items.push(this.selectedCyclist);
                } else {
                    this.selectedCyclist = new SelectedCyclist(this.p5, this.features, this.context.selected, this.context);
                    items.push(this.selectedCyclist);
                }
            } else {
                if (this.selectedCyclist != null) {
                    this.selectedCyclist.update(-1);
                    if (this.selectedCyclist.step == 0) {
                        this.selectedCyclist == null;
                    } else {
                        items.push(this.selectedCyclist);
                    }
                }
            }

            this.items = items;
        };

        this.draw = function(p5) {

            for (var item of this.items) {
                item.draw(p5);
            }

            if (this.context.selected != null) {
                console.log("selected:" + this.context.selected.number);
            }

        };
    };

    return ViewportManager;
});