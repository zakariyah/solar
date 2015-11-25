var RecommenderViewOnGame = function(agent)
{
	var recommender = agent;
	var thresholdRound = 10;


	var getInformationAboutOpponentAtRoundWithProp = function(round, properties)
	{
		var opponentInfo = [];
		var thresholdRound = 10;
		if(round == 0)
		{
			opponentInfo.push('I can\'t say anything about the other player.');
			opponentInfo.push('The game has just started');
		}
		else
		{
			var nice = properties.niceness;
			var bully = properties.bully;
			var reciprocity = properties.reciprocity;
			var reciprocateDefection = properties.reciprocateDefection;
			if(round < thresholdRound)
			{
				opponentInfo.push('The game is still quite fresh');
				return opponentInfo;
			}
			else if(round < thresholdRound * 2)
			{
				opponentInfo.push('The game is still quite fresh but');
			}
			if(bully > 50)
			{
				opponentInfo.push('He seems to be a bully');	
			}
			else
			{
				opponentInfo.push('He seems to be a nice guy');		
			}
			if(reciprocateDefection > 50)
			{
				opponentInfo.push('He also tries to reciprocate similar bad behaviour');
			}
			if(round > thresholdRound)
			{
				var isLeader = properties.opponentIsLeader;
				if(isLeader)
				{
					opponentInfo.push('He is also quite assertive');
				}
				else
				{
					opponentInfo.push('He is quite passive');
				}
			}
		}
		return opponentInfo;
	}

	this.getInformationAboutOpponent = function()
	{
		var round = recommender.getRound();
		var properties = recommender.getOpponnetProperties();
		return getInformationAboutOpponentAtRoundWithProp(round, properties);
	}

	this.getRecommendation = function()
	{
		var round = recommender.getRound();
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var recoHtml = []; // try to capture various emotions. 1.Assertiveness.
		recoHtml.push('I recommend that you play ' + options[recommendation]);
		return recoHtml;
	}

	this.getReason = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvictionLevel();
		var isGuilty = recommender.isOtherPlayerGuilty();
		var htmlReason = [];
		if(typeOfExpert == 'maximinBegin')
		{
			htmlReason.push('Let us see how this would play out. The game has just begun');
		}
		else if(typeOfExpert == 'minmax')
		{
			htmlReason.push('The other player is a great bully');
			htmlReason.push('He is likely to continue to defect');
		}
		else if(isGuilty)
		{	
			htmlReason.push('The other player is guilty and should be dealt with.');
			htmlReason.push('We can thus coerce him into being more cooperative');
		}
		else if(typeOfExpert == 'leader')
		{
			htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5).toFixed(2) + ' for each round on the long run.');
			htmlReason.push('If the other player profits by veering away from the plan, he will be punished');
		}
		else if(typeOfExpert == 'follower')
		{
			htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5).toFixed(2) + ' for each round on the long run.');
			htmlReason.push('The other player will be taking the lead in making us achieve this threshold');
			htmlReason.push('If the other player decides to be overtly smart, he will be dealt with');
		}
		else if(typeOfExpert == 'bestResponse')
		{
			htmlReason.push('This might be the best response to this guy');
		}
		return htmlReason;
	}

	this.getReasonForNotDoingOtherwise = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvictionLevel();
		var isGuilty = recommender.isOtherPlayerGuilty();
		var htmlReasonNotTo = [];
		if(isGuilty)
		{
			htmlReasonNotTo.push('The other player would feel it can always get away with impunity');
		}
		else if(typeOfExpert == 'leader')
		{
			htmlReasonNotTo.push('Considering your opponent, other options might not make you get the desired payoff');
		}
		else
		{
			htmlReasonNotTo.push("This should be better for you");
		}

		return htmlReasonNotTo;
	}

	this.howToDoBetter = function()
	{
		var expertDoingBetter = recommender.getBetterExperts();
		var betterHtml = [];
		if(expertDoingBetter)
		{
			betterHtml.push('You and the other player can make an average of ' + (expertDoingBetter[0] * 5).toFixed(2) + ' and ' + expertDoingBetter[1] * 5 + ' per round respectively');
			betterHtml.push('All you have to do is to ');
		}
		else
		{
			betterHtml.push('This seems to be the best you can achieve against this opponent');
		}
		return betterHtml;
	}


	this.getSolutionForRound = function()
	{
		return {'doBetter' : this.howToDoBetter(), 'reason' : this.getReason(), 'reasonOtherwise' : this.getReasonForNotDoingOtherwise(), 'recommendation' : this.getRecommendation(), 'opponentInfo' : this.getInformationAboutOpponent(), 'agentChoice' : recommender.latestChoice};
	}
}

module.exports = RecommenderViewOnGame;
// fall of ming
// the warlordss	