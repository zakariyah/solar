var mongoose = require('mongoose');
  var postQuizSurveySchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
, smartOpponent: String
, coopOpponent: String
, predOpponent: String,
humanAssociate: String,
smart: String
, coop: String,
predictable: String,
strategy: String,
strategyOpponent: String,
usefulRecommendation: String,
followRecommendation: String,
age: String,
gender: String,
nationality: String,
qualification: String,
field: String,
familiarity: String,
experience: String,
cummulativeScore:String,
numberOfRounds : String
});

postQuizSurveySchema.statics.createPostQuiz = function(information) {

    var newPostQuizSurvey = new this({
       playerid: information.playerid,
       gameid: information.gameid,
       smartOpponent: information.smartOpponent
, coopOpponent: information.coopOpponent
, predOpponent: information.predOpponent,
humanAssociate: information.humanAssociate,
smart: information.smart
, coop: information.coop,
predictable: information.predictable,
strategy: information.strategy,
strategyOpponent: information.strategyOpponent,
usefulRecommendation: information.usefulRecommendation,
followRecommendation: information.followRecommendation,
   		 age: information.age
, gender: information.gender
, nationality: information.nationality,
qualification: information.qualification,
majorfield: information.field
, familiar: information.familiarity,
playedbefore: information.experience,
cummulativeScore: information.cummulativeScore,
numberOfRounds : information.numberOfRounds
    });

    newPostQuizSurvey.save(function(err) {
        if (err)
            throw new Error('Could not create move');
        // callback(err, g);
    })
}

var postquizsurvey = mongoose.model('postquizsurvey',postQuizSurveySchema);
module.exports = postquizsurvey;