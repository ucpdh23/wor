class Cyclist {

    constructor(id, number, energy) {
        this.id = id;
        this.number=number;
        
        this.position = createVector(0 - random(items / 1.5), 3 - random(6));
        this.velocity = createVector(9, 0);
        this.acceleration = createVector(0, 0)
        this.acc_physics = createVector(0, 0);
        
        this.energy = energy;
    }
  
    update(data) {
        
    }
}
