
var mongoose = require('mongoose');
  var postQuizSurveySchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
, cummulativeScore: String
, numberOfRounds: String
, accessSkills: String,
enjoy: String,
familiarity: String
, risk: String,
age: String,
gender: String,
cooperative1: String,
forgiving1: String,
predictable1: String,
vengeful1: String,
selfish1: String,
});

postQuizSurveySchema.statics.createPostQuiz = function(information) {

    var newPostQuizSurvey = new this({
       playerid: information.playerid,
       gameid: information.gameid,
       cummulativeScore: information.cummulativeScore
, numberOfRounds: information.numberOfRounds
, accessSkills: information.accessSkills,
enjoy: information.enjoy,
familiarity: information.familiarity
, risk: information.risk,
age: information.age,
gender: information.gender,
   		 cooperative1: information.cooperative1
, forgiving1: information.forgiving1
, predictable1: information.predictable1,
vengeful1: information.vengeful1,
selfish1: information.selfish1
    });

    newPostQuizSurvey.save(function(err) {
        if (err)
            throw new Error('Could not create move');
        // callback(err, g);
    })
}

var postquizsurvey = mongoose.model('postquizsurvey',postQuizSurveySchema);
module.exports = postquizsurvey;