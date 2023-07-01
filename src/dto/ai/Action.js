class Action {
    constructor(name, preconditions, postconditions, execute) {
        this.name = name;
        this.preconditions = preconditions;
        this.postconditions = postconditions;
        this.execute = execute;
    }

    execute(state) {
        this.execute(state);
    }

    getPreconditions() {
        return this.preconditions;
    }

    getPostconditions() {
        return this.postconditions;
    }
}

module.exports = Action;
