class Action {
    constructor(name, preconditions, postconditions, execute) {
        this.name = name;
        this.preconditions = preconditions;
        this.postconditions = postconditions;
        this._execute = execute;
    }

    execute(state, memory) {
        return this._execute(state);
    }

    getPreconditions() {
        return this.preconditions;
    }

    getPostconditions() {
        return this.postconditions;
    }
}

module.exports = Action;
