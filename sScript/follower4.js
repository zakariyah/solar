//FOLLOWER4 EXPERT (alt and fair but matching actions)


var FSMInfo = function()
{

    var EVENTS = {
        'nc1': 'player did not comply',
        'nc2': 'associate did not comply',
        's': 'player is satisfied'
    };

    //Make into a constant to prevent modifications
    Object.freeze(EVENTS);

    var MESSAGES = [
        'f4 Let\'s alternate between {A} and {B}',
        'You did not follow my previous suggestion',
        'You refused to follow my guidance',
        'Your associate did not comply',
        'Your associate betrayed you',
        'Good teamwork',
        'Sweet. You are getting rich',
        'Keep it up',
        'Dont get tempted!',
        'Things are getting better',
        'It\'s your turn to  play "recommended action"'
    ];

    //Used by S0 to always transition to S1
    this.CATCH_ALL_EVENT = 'ALL';

    //Transition maps
    var LEADER2_TRANSITION_MAP = {
        'S0': {
            'ALL': {
                messageIds: [0, 10],
                endState: 'S1'
            }
        },
        'S1': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [10],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [10],
                endState: 'S2'
            },
            's': {
                messageIds: [7, 10],
                endState: 'S2'
            }
        },
        'S2': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [10],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [10],
                endState: 'S2'
            },
            's': {
                messageIds: [7, 10],
                endState: 'S3'
            }
        },
        'S3': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [10],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [10],
                endState: 'S2'
            },
            's': {
                randMessageIds: [6, 8],
                messageIds: [10],
                endState: 'S4'
            }
        },
        'S4': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [10],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [10],
                endState: 'S2'
            },
            's': {
                messageIds: [7, 8, 10],
                endState: 'S5'
            }
        },
        'S5': {
            'nc1': {
                randMessageIds: [1, 2],
                messageIds: [10],
                endState: 'S1'
            },
            'nc2': {
                randMessageIds: [3, 4],
                messageIds: [10],
                endState: 'S2'
            },
            's': {
                randMessageIds: [7, 8],
                messageIds: [10],
                endState: 'S5'
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