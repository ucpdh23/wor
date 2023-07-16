const Goals = require('./GoalsFactory')
const Actions = require('./ActionsFactory')
const Memory = require('./Memory')

class Planner {
    constructor(team, stage) {
        this.stage = stage;
        this.team = team;

        this.memory = new Memory(team, stage);

        this.currentGoal = Goals.IDLE;
        this.currentAction = Actions.IDLE;
        this.goals = Object.keys(Goals);
    }

    init() {
        // Aquí define una estrategia general para la etapa (pero ojo que puede ir cambiando)
    }

    setGoals(goals) {
        this.goals = goals;
    }

    update(state) {
        var actionResult = this.currentAction.execute(state, this.memory);
        const executed = actionResult.executed;

        if (executed == 0) {
            // en progreso

        } else if (executed > 0) {
            // completado, ir al siguiente action
            this._nextAction(state, actionResult);

        } else if (executed < 0) {
            // algo ha fallado, hay que volver a calcular un plan
            this._evaluatePlan(state);
        }

        return true;
    }

    nextAction(state, actionResult) {
        this.currentAction = this.currentAction.getNext(actionResult);
        this.memory.addAction(this.currentAction, state);
    }

    _evaluatePlan(state) {
        var newGoal = Goals.IDLE;

        this.goals.forEach(goal => {
            if (goal.isValid(state)) {
                if (newGoal.getReward() < goal.getReward()) {
                    newGoal = goal;
                }
            }
        });
        
        newGoal.resolveGraphOfActions()

    }

}

module.exports = Planner