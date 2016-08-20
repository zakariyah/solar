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

    var MESSAGES = [
        'You did not follow my previous suggestion',
        'You refused to follow my guidance',
        'He has been cooperative!',
        'Things are looking good',
        'He hasn\'t been cooperative ',
        'So in this round, play "recommended action"'
    ];

    //Used by S0 to always transition back to S0
    this.CATCH_ALL_EVENT = 'ALL';

    //Transition maps
    var MBRL_TRANSITION_MAP = {
        'S0': {
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
          'S1': {
            'nc1': {
                randMessageIds: [0, 1],
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
        return LEADER2_TRANSITION_MAP;
    }

    this.getMessages = function()
    {
        return MESSAGES;
    }

}


module.exports = FSMInfo;