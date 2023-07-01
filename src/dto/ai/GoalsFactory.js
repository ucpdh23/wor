const Goal = require('./Goal');
const Actions = require('./ActionsFactory')

const Goals = {
    CE: new Goal("Controlar Etapa", 100,
        (context) => { return true},
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