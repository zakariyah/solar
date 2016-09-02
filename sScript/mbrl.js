//MBRL expert


var FSMInfo = function()
{

    var EVENTS = {
        'nc1': 'player did not comply',
        's': 'satisfied',
        'ns': 'not satisfied'
    };

    //Make into a constant to prevent modifications
    Object.freeze(EVENTS);

    var MESSAGES = [ // check messages here again
        ' mbrl Let us try this',
        ' You refused to follow my guidance',
        ' He has been cooperative!',
        ' Things are looking good',
        ' You can do better',
        ' So in this round, play '
    ];

    //Used by S0 to always transition back to S0
    this.CATCH_ALL_EVENT = 'ALL';

    //Transition maps
    var MBRL_TRANSITION_MAP = {
        'S0': {
            'ALL': {
                messageIds: [0, 5],
                endState: 'S1'
            }
        },
          'S1': {
            'nc1': {
                randMessageIds: [1],
                messageIds: [5],
                endState: 'S1'
            },
            's': {
                randMessageIds: [2, 3],
                messageIds: [5],
                endState: 'S1'
            },
            'ns': {
                messageIds: [4, 5],
                endState: 'S1'
            }
        }
     };



    this.getEvents = function()
    {
        return EVENTS;
    }
    this.getTransitionMap = function()
    {
        return MBRL_TRANSITION_MAP;
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