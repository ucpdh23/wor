const Predicate = require('./Predicate');

const Predicates = {
    TRUE: new Predicate("True", x => true),
    FALSE: new Predicate("False", x => false)
}

module.exports = Predicates;