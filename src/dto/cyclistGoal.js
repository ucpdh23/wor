const StateMachine = require('./stateMachine')
const Utils = require('../dto/utils')

function createDefaultStateMachine() {
    return StateMachine.createMachine({
        initialState: 'init',
        init: {
            actions: {
                onEnter(ctx) {
                    // console.log('off: onEnter')
                },
                onExit(ctx) { },
                onExecute(ctx) {
                    ctx.cyclist.computeForces_1(ctx.first);
                }
            },
            operations: ['pull', 'takeUp', 'takeDown'],
            computeTransition(ctx) {
                if (ctx.message == 'tira'
                    || ctx.message == 'pull') {
                    var targetName = 'preparePulling';

                    if (ctx.first.id == ctx.cyclist.id) targetName = 'pulling';

                    ctx._pullingLevel = ctx.msgPayload;

                    return {
                        target: targetName,
                        action() {
                            ctx.message = '';

                        },
                    };
                } else if (ctx.message === 'salta' || ctx.message === 'takeUp') {
                    //dependiendo de lo lejos puede saltar o no
                    return {
                        target: 'preparePulling',
                        action(ctx) {
                            ctx._preparePullingNext = 'salta'
                            ctx._preparePullingMeters = 3;
                        }
                    };
                } else if (ctx.message == 'protege') {
                    var expected = ctx.msgPayload;
                    var index = ctx.cyclist.group.indexOf(expected);

                    if (index != -1) {
                        var target = ctx.cyclist.group.cyclists[index];
                        ctx._followTarget = target;
                        return {
                            target: 'follow',
                            action(ctx) {

                            }
                        };
                    }
                } else if (ctx.message === 'avanza') {
                    //dependiendo de lo lejos puede saltar o no
                    return {
                        target: 'preparePulling',
                        action(ctx) {
                            ctx._preparePullingNext = 'init'
                            ctx._preparePullingMeters = 5;
                        }
                    };

                } else if (ctx.message === 'adelanta') {
                    print("adelantando...");

                    return {
                        target: 'adelanta',
                        action() { }
                    };
                } else if (ctx.message === 'acelera') {
                    ctx.cyclist.startSelfAcc = true;
                    ctx.cyclist.selfAccLevel = 3;
                } else if (ctx.message === 'desacelera') {
                    ctx.cyclist.startSelfAcc = true;
                    ctx.cyclist.selfAccLevel = -3;
                } else if (typeof ctx.message == 'string' && ctx.message.startsWith('acelera#')) {
                    var val = parseFloat(ctx.message.split('#')[1]);

                    ctx.cyclist.startSelfAcc = true;
                    ctx.cyclist.selfAccLevel = val;
                }
                if (ctx.cyclist.id == ctx.first.id) {
                    return {
                        target: 'first',
                        action() { },
                    };
                } else {
                    if (ctx.cyclist.shouldReduceDraft()) {
                        var candidate = ctx.cyclist.findCandidate();

                        if (candidate !== null) {
                            ctx.cyclist._reduceDraftCandidate = candidate;
                            ctx.cyclist._reduceDraftTime = ctx.cyclist.time;

                            return {
                                target: 'reduceDraft',
                                action() { },
                            };
                        }
                    }
                }
            },
        },
    });
}

exports.createDefaultStateMachine = createDefaultStateMachine;