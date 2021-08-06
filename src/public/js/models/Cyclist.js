define([
    'models/Vector'
], function (Vector) {
    var cyclistClass = function (id, number, energy) {
        this.id = id;
        this.number = number;
        this.energy = energy;

        this.position = new Vector(0 ,0);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0)
        this.acc_physics = new Vector(0, 0);

        this.update = function (data) {
        }
    }

    return cyclistClass;
});

