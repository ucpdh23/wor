const Goal = require('./Goal');
const Actions = require('./ActionsFactory')
const GoalUtils = require('./GoalUtils')

const Goals = {
    CE: new Goal("Controlar Etapa de Montaña", 100,
        (context) => { return GoalUtils.profileMatchesMyTeam(context) && GoalUtils.enoughCyclistsInRightGroup(context);},
        [Actions.MOVE_UP_PRINCIPALS]
    ),
    EF: new Goal("Estar en la Fuga", 100,
        (context) => { return true},
        [Actions.MOVE_UP_PRINCIPALS]
    ),
    IDLE: new Goal("Idle", 100,
        (context) => { return true},
        [Actions.IDLE]
    )
}

module.exports = Goals;