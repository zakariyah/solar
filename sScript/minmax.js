//minmax expert


var FSMInfo = function()
{

    var EVENTS = {
        'nc1': 'player did not comply',
        's': 'player is satisfied'
    };


    //Make into a constant to prevent modifications
    Object.freeze(EVENTS);

    var MESSAGES = [
        'minmax You did not follow my previous suggestion',
        'You refused to follow my guidance',
        'Your associate is exploiting you, protect yourself!',
        'Minimize your possible loss ',
        'So in this round, play "recommended action"'
    ];

    //Used by S0 to always transition back to S0
    this.CATCH_ALL_EVENT = 'ALL';

    //Transition maps
    var MINMAX_TRANSITION_MAP = {
          'S0': {
            'ALL': {
                randMessageIds: [2, 3],
                messageIds: [4],
                endState: 'S0'
            }
        }
        'S1': {
            'nc1': {
                randMessageIds: [0, 1],
                messageIds: [4],
                endState: 'S1'
            }
            's': {
                randMessageIds: [2, 3],
                messageIds: [4],
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

    this.updateMessage = function(choice)
    {
        var lenOfMesage = MESSAGES.length;
        var newMessages = MESSAGES.slice();
        newMessages[lenOfMesage - 1] = newMessages[lenOfMesage - 1] + choice;
        return newMessages;
    }
}


module.exports = FSMInfo;