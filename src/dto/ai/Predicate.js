class Predicate {
    constructor(name, functor) {
        this.name = name;
        this.functor = functor;
    }
    eval(state) {
        return this.functor(state);
    }
}

module.exports = Predicate;