function createMachine
  (stateMachineDefinition,
   listener) {
    const machine = {
        // machine object
        value: stateMachineDefinition.initialState,
        context: {
          lastChangeTimestamp: new Date().getTime(),
          lastChangePosition: null
        },
        execute(ctx) {
            const currentStateDefinition = stateMachineDefinition[machine.value];

            currentStateDefinition.
                actions.onExecute(ctx);
        },
        transition(ctx) {
            const currentStateDefinition = stateMachineDefinition [machine.value];
            
            if (listener !== undefined) {
              listener.loadContext(ctx);
            }
            
            const destinationTransition = currentStateDefinition.computeTransition(ctx);
            if (!destinationTransition) {
                //currentStateDefinition.actions.onExecute(ctx);

                return
            }
            const destinationState = destinationTransition.target
            const destinationStateDefinition = stateMachineDefinition[destinationState];
            if (destinationTransition.hasOwnProperty('action')) {
                destinationTransition.action(ctx)
            }
            //  destinationTransition.action(ctx)
            currentStateDefinition.actions.onExit(ctx);
            
            if (listener !== undefined) {
             listener.storeContext(ctx);
            }

            destinationStateDefinition.actions.onEnter(ctx);
            machine.value = destinationState
            return machine.value
        },
        getCurrentOperations() {
            const currentStateDefinition = stateMachineDefinition[machine.value];
            return currentStateDefinition.operations;
        }
    }
    return machine
}

exports.createMachine = createMachine;