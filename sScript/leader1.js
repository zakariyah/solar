//LEADER1 EXPERT (Pure and Fair)

var FSMInfo = function()
{


    var EVENTS = {
        'nc1': 'player did not comply',
        'nc2': 'associate did not comply',
        's': 'player is satisfied',
        'g': ' associate is guilty'
    };

    // check nc1 first, if player did not comply then no need to check on the opponent
    // if player however complied, then we check associates' compliance next
    //Make into a constant to prevent modifications
    Object.freeze(EVENTS);

    var MESSAGES = [
        'l1 Always play C',
        'You did not follow my previous suggestion',
        'You refused to follow my guidance',
        'Your associate did not comply',
        'Your associate refused to follow your lead',
        'He/she deserves to be punished!',
        'Good teamwork',
        'Sweet. You are getting rich',
        'Keep it up',
        'Dont get tempted!',
        'Things are getting better',
        'So in this round, play recommended action'
    ];

    //Used by S0 to always transition to S1
    this.CATCH_ALL_EVENT = 'ALL';

    //Transition maps
    var LEADER2_TRANSITION_MAP = {
        'S0': {
            'ALL': {
                messageIds: [0],
                endState: 'S1'
            }
        },
        'S1': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [11],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [11],
                endState: 'S2'
            },
            'g': {
                randMessageIds: [3, 4],
                messageIds: [5, 11],
                endState: 'S6'
            },
            's': {
                messageIds: [6, 11],
                endState: 'S2'
            }
        },
        'S2': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [11],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [11],
                endState: 'S2'
            },
            'g': {
                randMessageIds: [3, 4],
                messageIds: [5,11],
                endState: 'S6'
            },
            's': {
                messageIds: [6, 11],
                endState: 'S3'
            }
        },
        'S3': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [11],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [11],
                endState: 'S2'
            },
            'g': {
                randMessageIds: [3, 4],
                messageIds: [5, 11],
                endState: 'S6'
            },
            's': {
                randMessageIds: [7, 8],
                messageIds: [11],
                endState: 'S4'
            }
        },
        'S4': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [11],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [11],
                endState: 'S2'
            },
            'g': {
                randMessageIds: [3, 4],
                messageIds: [5, 11],
                endState: 'S6'
            },
            's': {
                messageIds: [8, 9, 11],
                endState: 'S5'
            }
        },
        'S5': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [11],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [11],
                endState: 'S2'
            },
            'g': {
                randMessageIds: [3, 4],
                messageIds: [5, 11],
                endState: 'S6'
            },
            's': {
                randMessageIds: [8, 9],
                messageIds: [11],
                endState: 'S5'
            }
        },
        'S6': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [11],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [11],
                endState: 'S6'
            },
            'g': {
                messageIds: [11],
                endState: 'S6'
            },
            's': {
                messageIds: [10, 11],
                endState: 'S3'
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