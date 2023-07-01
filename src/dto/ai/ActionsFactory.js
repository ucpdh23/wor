const Action = require('./Action');
const Predicates = require('./PredicatesFactory');
const ActionResult = require('./ActionResult');

const Actions = {
    IDLE: new Action("Idle", [], [], x => { return new ActionResult(0, null)}),
    MOVE_UP_PRINCIPALS: new  Action("In Alert", [Predicates.TRUE], [Predicates.FALSE], x => { return new ActionResult(0, null)})
}

module.exports = Actions;