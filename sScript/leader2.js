//LEADER2 EXPERT (Pure and Fair but defects)

var FSMInfo = function()
{
    

    var EVENTS = {
        'nc1': 'player did not comply',
        'nc2': 'associate did not comply',
        's': 'player is satisfied',
        'g': ' associate is guilty'
    };

    //Make into a constant to prevent modifications
    Object.freeze(EVENTS);

    var MESSAGES = [
        'l2 Always play B',
        'You did not follow my previous suggestion',
        'You refused to follow my guidance',
        'Your associate did not comply',
        'Good teamwork',
        'Keep it up',
        'Things are getting better',
        'In this round, play '
    ];

    //Used by S0 to always transition to S1
    this.CATCH_ALL_EVENT = 'ALL';

    //Transition maps
    var LEADER2_TRANSITION_MAP = {
        'S0': {
            'ALL': {
                messageIds: [0, 7],
                endState: 'S1'
            }
        },
        'S1': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [7],
                endState: 'S1'
            },
            'nc2': {
                messageIds: [3, 7],
                endState: 'S2'
            },
            'g': {
                messageIds: [3, 7],
                endState: 'S5'
            },
            's': {
                messageIds: [6, 7],
                endState: 'S2'
            }
        },
        'S2': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [7],
                endState: 'S1'
            },
            'nc2': {
                messageIds: [3, 7],
                endState: 'S2'
            },
            'g': {
                messageIds: [3, 7],
                endState: 'S5'
            },
            's': {
                messageIds: [6, 7],
                endState: 'S3'
            }
        },
        'S3': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [7],
                endState: 'S1'
            },
            'nc2': {
                messageIds: [3, 7],
                endState: 'S2'
            },
            'g': {
                messageIds: [3, 7],
                endState: 'S5'
            },
            's': {
                messageIds: [6, 7],
                endState: 'S4'
            }
        },
        'S4': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [7],
                endState: 'S1'
            },
            'nc2': {
               messageIds: [3, 7],
                endState: 'S2'
            },
            'g': {
                messageIds: [3, 7],
                endState: 'S5'
            },
            's': {
                messageIds: [6, 7],
                endState: 'S4'
            }
        },
        'S5': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [7],
                endState: 'S1'
            },
            'nc2': {
                messageIds: [3, 7],
                endState: 'S2'
            },
            'g': {
                messageIds: [3, 7],
                endState: 'S5'
            },
            's': {
                messageIds: [6, 7],
                endState: 'S2'
            }
        }
    };


    this.getEvents = function()
    {
        return EVENTS;
    }
    this.getTransitionMap = function()
    {
        return LEADER2_TRANSITION_MAP;
    }

    this.getMessages = function()
    {
        return MESSAGES;
    }

    this.updateMessage = function(choice)
    {
        var lenOfMesage = MESSAGES.length;
        var newMessages = MESSAGES.slice();
        newMessages[lenOfMesage - 1] = newMessages[lenOfMesage - 1] + choice;
        return newMessages;
    }
}


module.exports = FSMInfo;