var mongoose = require('mongoose');
  var chatHistorySchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String },
  question: {type : String},
  answer : {type:String},
  round : {type: Number}
});

chatHistorySchema.statics.createChatHistory = function(gameId, id, question, answer, round) {

    var newChatHistory = new this({
       playerid: id,
       gameid: gameId,
       question: question,
       answer : answer,
       round : round
    });
    // console.log('question given 7&&&&&&&&&&&&&&&& is ' + question);
    newChatHistory.save(function(err) {
        if (err)
            throw new Error('Could not create move');
      // console.log("hereree");
    })
}


var chatHistory = mongoose.model('chatHistory',chatHistorySchema);
module.exports = chatHistory;