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
				opponentInfo.push('The game is still quite fresh but ');
			}
			if(bully > 50)
			{
				opponentInfo.push('He seems to be a bully');	
			}
			if(reciprocateDefection > 50)
			{
				opponentInfo.push('He also tries to recprocate simile bad behaviour');
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
		var recommendation = recommender.latestChoice;
		var recoHtml = ''; // try to capture various emotions. 1.Assertiveness.
		recoHtml += 'I recommend that you play ' + recommendation;
		return recoHtml;
	}

	this.getReason = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvinctionLevel();
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
			htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5) + ' for each round on the long run.');
			htmlReason.push('If the other player profits by veering away from the plan, he will be punished');
		}
		else if(typeOfExpert == 'follower')
		{
			htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5) + ' for each round on the long run.');
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
		var getConvinctionLevel = recommender.getConvinctionLevel();
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

		return htmlReasonNotTo;
	}

	this.howToDoBetter = function()
	{
		var expertDoingBetter = recommender.getBetterExperts();
		var betterHtml = [];
		if(expertDoingBetter)
		{
			betterHtml.push('You can do better by doing this');
		}
		else
		{
			betterHtml.push('This seems to be the best you can achieve with this opponnet');
		}
		return betterHtml;
	}
}

module.exports = RecommenderViewOnGame;
// fall of ming
// the warlordss