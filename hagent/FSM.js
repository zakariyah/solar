function Transition(startState, endState, event, transitionMessage) {
    this.startState = startState;
    this.endState = endState;
    this.triggerEvent = event;
    this.message = transitionMessage;
}

Transition.prototype.getTransitionLog = function () {
    return 'State transition: ' +
        this.startState.name + ' -> ' + this.endState.name +
        ' with transition message: ' + this.message +
        ' was triggered by event ' + this.triggerEvent;
};

function State(stateName, transitionMap, catchAll) {
    this.name = stateName;
    this.transitionMap = transitionMap;
    this.CATCH_ALL_EVENT = catchAll;
}

State.prototype.getTransitionInfoForEvent = function (event) {
    var stateInfo = this.transitionMap[event] || this.transitionMap[this.CATCH_ALL_EVENT];
    if (!stateInfo) {
        throw new Error('Unknown event: ' + event + 'for state: ' + this.stateName);
    }

    return stateInfo;
}

function FSM(startStateName, transitionMap, EVENTS, MESSAGES, catchAll) {
    if (!startStateName) {
        throw new Error('Must specify a start state!');
    }

    this.transitionMap = transitionMap;
    Object.freeze(this.transitionMap);

    this.EVENTS = EVENTS;
    this.MESSAGES = MESSAGES;
    

    var startStateInfo = this.transitionMap[startStateName];
    var startState = new State(startStateName, startStateInfo,  catchAll);

    this.history = [];
    this.currentState = startState;
    this.currentMessage = '';
}

FSM.prototype.transition = function (event) {
    if (!this.EVENTS[event]) {
        throw new Error('Unknown event!: ' + event);
    }

    var transitionInfo = this.currentState.getTransitionInfoForEvent(event);
    var newStateName = transitionInfo.endState;
    var newStateTransitionInfo = this.transitionMap[newStateName];
    var newState = new State(newStateName, newStateTransitionInfo);

    this.currentMessage = this.getMessageForTransition(transitionInfo)
    var transition = new Transition(this.currentState, newState, event, this.currentMessage);
    this.currentState = newState;
    this.history.unshift(transition);
    return this.currentMessage;
}

FSM.prototype.getMessageForTransition = function (transitionInfo) {
    var message = '';
    var messageIds = transitionInfo.messageIds;
    var randMessageIds = transitionInfo.randMessageIds;

    var randMessagesLen = randMessageIds && randMessageIds.length;
    if (randMessagesLen) {
        var selection = Math.floor(Math.random() * randMessagesLen);
        var randMessageId = randMessageIds[selection];
        message = this.MESSAGES[randMessageId] + ' ';; 
    }

    for (var i = 0, len = messageIds.length; i < len; i++) {
        var messageId = messageIds[i];
        var messageText = this.MESSAGES[messageId];
        message += messageText + ' ';
    }

    return message;
}

FSM.prototype.getHistory = function () {
    var logs = [];

    for (var i = 0, len = this.history.length; i < len; i++) {
        var transition = this.history[i];
        logs.unshift(transition.getTransitionLog());
    }

    return logs.join('\n');
}

module.exports = FSM;