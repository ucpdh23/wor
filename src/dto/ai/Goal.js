class Goal {
    constructor(name, reward, isValidFunction, actions) {
        this.name = name;
        this.reward = reward;
        this.isValidFunction = isValidFunction;
        this.actions = actions;
    }

    isValid(state) {
        return this.isValidFunction(state);
    }

    getReward() {
        return this.reward;
    }

}

module.exports = Goal;