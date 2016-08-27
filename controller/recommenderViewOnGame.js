var RecommenderViewOnGame = function(agent)
{
	var recommender = agent;
	var thresholdRound = 5;
	var introHasBeenSaid = false;

	var isPlayerCompliant = function()
	{ // checks to see if the player complied with the recommendation given
		// var playerAct = recommender
		var history = recommender.gameHistory;
		// console.log('checing compliance +++++++++++');
		// console.log('history ' + history);
		var len = history.length;
		
		if(len == 0)
		{
			return false;
		}
		var hist = recommender.recommendationHistory
		// console.log('recommendation history ' + hist);
		// console.log('ending compliance +++++++++++' + hist.length + '  ' + history.length );

		return hist[hist.length - 2] == history[len - 1][0];
	}


	var isOpponentCompliant = function()
	{ 
		// checks if the opponent 
		var optionForOpponent = recommender.getLastOptionForOpponent();
		var history = recommender.gameHistory;
		var len = history.length;
		
		if(len == 0)
		{
			return false;
		}
		return optionForOpponent == history[len - 1][1];
	}

	var opponentIsGuilty = function()
	{
		return recommender.profitedFromDefection
	}

	var isSatisfied = function()
	{
		return recommender.isSatisfied();
	}

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
				opponentInfo.push('I can\'t really say anything about the other player');
				return opponentInfo;
			}
			else if(round < thresholdRound * 2)
			{
				opponentInfo.push('The game is still quite fresh but');
			}
			if(bully > 50)
			{
				opponentInfo.push('He seems to be a bully  <button class="button">Explain</button>');	
			}
			else
			{
				opponentInfo.push('He seems to be a nice guy <button class="button">Explain</button>');		
			}
			if(reciprocateDefection > 50)
			{
				opponentInfo.push('He also tries to reciprocate seemingly bad behaviour <button class="button">Explain</button>');
			}
			if(round > thresholdRound)
			{
				var isLeader = properties.opponentIsLeader;
				if(isLeader)
				{
					opponentInfo.push('He is also quite assertive <button class="button">Explain</button>');
				}
				else
				{
					opponentInfo.push('He is quite passive <button class="button">Explain</button>');
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

	var chooseOneRandomly = function(textArray)
	{
		if(!textArray)
		{
			return
		}
		var index = Math.floor(Math.random() * textArray.length);
		return textArray[index];
	}

	var getRecommendationHtmlForExpertType = function(typeOfExpert, round)
	{
		var rec = [];
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var info = recommender.getCurrentExpertInfo();

		var choice = options[recommendation];
		var choices = '';
		// introHasBeenSaid = false;

		rec = ['Choose ' + choice ];
		rec.push('Choice is ' + recommendation);
		
		if(recommender.getRound() > 1)
		{
			rec.push('opponent last option according to my expert was ' + recommender.getLastOptionForOpponent());	
			if(recommender.getCurrentStateMachine())
			{	
				rec.push('expert first message is ' + recommender.getCurrentStateMachine().getFirstMessage());	
			}
		}
		
		rec.push(info);

		return rec;
		
	}


	this.getRecommendation = function()
	{
		var myOptions = [];
		var vals = recommender.presentExpertInformation;
		var expertName = recommender.expertName;
		var round = recommender.getRound();

		// console.log('Expert name is  ' + expertName + " " + vals);
		// var whyForOptions = [];
		var stateMachine;

		var event  = getEventToFire(expertName);
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;

		var choice = options[recommendation];

		
		if(round <  1)
		{
			myOptions.push('Let us start with ' + choice);
		}
		else
		{
			stateMachine = recommender.getCurrentStateMachine();
			if(expertName == 'minmax')
			{
				myOptions.push("maximin Protect yourself, always play 'B'");
				myOptions.push("You are at risk of being exploited so you need to protect yourself. ");
			}
			else if(expertName == 'leader' | expertName == 'follower' | expertName == 'bestResponse')
			{
				myOptions.push(stateMachine.transition(event, choice));
			}
			else
			{
				myOptions.push("Text not yet implemented for state expert name " + expertName);
			}	
		}
		
		return myOptions;
	}

	this.getReason = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvictionLevel();
		var isGuilty = recommender.isOtherPlayerGuilty();
		var htmlReason = [];
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var choice = options[recommendation];
		var choices = [];
		if(typeOfExpert == 'maximinBegin')
		{
			choices = ['Let us see how this would play out. The game has just begun'];
		}
		else if(typeOfExpert == 'minmax')
		{
			// htmlReason.push('The other player is a great bully');
			// htmlReason.push('He is likely to continue to defect');
			choices.push('Your associate is expoiting you, protect yourself by choosing ' + choice);
			choices.push('You risk losing points by playing other than the recommended action');
		}
		
		if(typeOfExpert == 'leader')
		{
			// htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5).toFixed(2) + ' for each round on the long run.');
			// htmlReason.push('If the other player profits by veering away from the plan, he will be punished');
			choices.push('You may improve your payoff if you focus on influencing (or "guiding") your associate. ');
			choices.push('You may be able to influence your associate by choosing ' + choice);
		}
		else if(typeOfExpert == 'follower')
		{
			// htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5).toFixed(2) + ' for each round on the long run.');
			// htmlReason.push('The other player will be taking the lead in making us achieve this threshold');
			// htmlReason.push('If the other player decides to be overtly smart, he will be dealt with');
			choices.push('You need to accept a compromise, therefore choose ' + choice);
			choices.push('It seems your associate is expecting you to comply with him by choosing ' + choice);
			// choices = ['You need to accept a compromise, therefore choose ' + choice, 'You associate expects him to comply with him by choosing ' + choice];
		}
		else if(typeOfExpert == 'bestResponse')
		{
			// htmlReason.push('This might be the best response to this guy');
			if(recommendation == 0)
			{
				choices.push('Your associate has been cooperative, so you should reciprocate by choosing ' + choice);	
			}
			else
			{
				choices.push('Your associate has been uncooperative, so you should retaliate by choosing ' + choice);
			}
			
		}

		if(isGuilty)
		{	
				// htmlReason.push('The other player is guilty and should be dealt with.');
				// htmlReason.push('We can thus coerce him into being more cooperative');
				choices.push('You are done punishing your associate, now proceed by playing ' + choice);
		}
		else
		{
			choices.push('"Your associate refused to follow your guidance, punish him by playing ' + choice);
		}
		
		htmlReason.push(chooseOneRandomly(choices));
		return htmlReason;
	}

	this.getReasonForNotDoingOtherwise = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvictionLevel();
		var isGuilty = recommender.isOtherPlayerGuilty();

		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var choice = options[recommendation];
		var choices = [];

		var htmlReasonNotTo = [];
		if(isGuilty && typeOfExpert == 'leader')
		{
			// htmlReasonNotTo.push('The other player would feel it can always get away with impunity');
			choices.push('Your associate betrayed you! He needs to pay for it');
			choices.push('"Your associate refused to follow your lead, punish him by playing ' + choice);			
		}
		else if(typeOfExpert == 'follower')
		{
			// htmlReasonNotTo.push('Considering your opponent, other options might not make you get the desired payoff');
			choices.push("You associate is likely to punish you in future rounds if you don't compky with him.");
		}
		else if(typeOfExpert == 'bestResponse')
		{
			// htmlReasonNotTo.push("This should be better for you");
			choices.push("You should act in your best interest");
		}
		else if(typeOfExpert == 'minmax')
		{
			choices.push("You are vulnerable, if you don't protect yourself, your partner will exploit you");
		}

		htmlReasonNotTo.push(chooseOneRandomly(choices));
		return htmlReasonNotTo;
	}

	this.howToDoBetter = function()
	{
		// returns an array
		var expertDoingBetter = recommender.getBetterExperts();
		var betterHtml = [];
		var whyForOptions = [];
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

	var getEventToFire = function(expertName)
	{
		if(expertName == 'leader')
		{
			if(!isPlayerCompliant())
			{
				return 'nc1';
			}
			else if(!isOpponentCompliant())
			{
				return 'nc2';
			}
			else if(opponentIsGuilty())
			{
				return 'g';
			}
			else if(isSatisfied())
			{
				return 's';
			}
		}
		else if(expertName == 'follower')
		{
			if(!isPlayerCompliant())
			{
				return 'nc1';
			}
			else if(!isOpponentCompliant())
			{
				return 'nc2';
			}
			else if(isSatisfied())
			{
				return 's';
			}
		}
		else if(expertName == 'minmax')
		{
			if(!isPlayerCompliant())
			{
				return 'nc1';
			}
			else if(isSatisfied())
			{
				return 's';
			}	
		}
		else if(expertName == 'bestResponse')
		{
			if(!isPlayerCompliant())
			{
				return 'nc1';
			}
			else if(isSatisfied())
			{
				return 's';
			}
			else
			{
				return 'ns';
			}
		}
		return 's';
	}

	var generateRandomNumber = function()
	{
		var num = Math.floor(Math.random() * 100000000) + 1;
		return num;
	}

	// var onClickExplain = function(explainId)
	// {
	// 	return function()
	// 	{
	// 		var explain = document.getElementById('explain' +explainId);
	// 		explain.style.display = 'inline';
	// 	}
	// }

	this.whatAreMyOptions = function()
	{
		// returns two arrays as an array
		// var num = generateRandomNumber();
		var myOptions = [];
		// var vals = recommender.presentExpertInformation;
		// var expertName = recommender.expertName;
		var satisficingExperts = recommender.getPartOfSatisficing();

		// console.log('Expert name is  ' + expertName + " " + vals);
		var whyForOptions = [];
		// console.log('^^^^^^^^^^^^^^^^^^^^^');
		for(var i = 0 ; i < satisficingExperts.length; i++)
		{
			// console.log(satisficingExperts[i]);
			var vals = satisficingExperts[i].expertInformation;
			var expertName = satisficingExperts[i].expertName;
			if(expertName == 'leader')
			{
				if(vals == 1)
				{
					myOptions.push("Enforce cooperation by always playing 'A'.");
					myOptions.push("If your associate does not cooperate, punish him by playing 'B'. This is a great solution as cooperation will give both of you high and equal payoffs.");
				}
				else if(vals == 2)
				{
					myOptions.push("Protect yourself! ");
					myOptions.push("Always play 'B'. You are at risk of being exploited so you need to protect yourself.");
				}
				else if(vals == 3)
				{
					myOptions.push("Both of you can take turns receiving the highest possible payoff.")
					myOptions.push("You do so by playing (B) when your associate plays (A) and vice versa. If your associate does not comply, punish him. This is a good solution as both of you will receive high and equal payoffs.");
				}
				else if(vals == 4)
				{
					myOptions.push("Alternate between the two actions ");	
					myOptions.push("You do so by both playing /'A/' in one round and both playing /'B/' in the proceeding round. If your associate does not comply, punish him. It's a fair solution as both of you will receive equal payoffs.");
				}
				else if(vals == 5)
				{
					myOptions.push("Always cooperate. ");
					myOptions.push("You continue to play 'A' even though your associate does not reciprocate. This is okay as you still do better that not cooperating at all.");
				}
				else if(vals == 6)
				{
					myOptions.push("Alternate between the two actions. ");
					myOptions.push("If he is being cooperative, then alternate between (A,B). You deserve a higher payoff if he lets you!");
				}
			}
			else if(expertName == 'follower')
			{
				if(vals == 1)
				{
					myOptions.push("Always cooperate by playing 'A'. ");
					myOptions.push("It's a great solution as cooperation will give both of you high and equal payoffs.");
				}
				else if(vals == 2)
				{
					myOptions.push("Protect yourself, always play 'B' ");
					myOptions.push("You are at risk of being exploited so you need to protect yourself.");
				}
				else if(vals == 3)
				{
					myOptions.push("Both of you can take turns receiving the highest possible payoff. ");
					myOptions.push("You do so by playing (B) when your associate plays (A) and vice versa. It's a good solution as both of you will receive high and equal payoffs.");
				}
				else if(vals == 4)
				{
					myOptions.push("Alternate between the two actions. ");	
					myOptions.push("You do so by both playing 'A' in one round and both playing 'B' in the proceeding round. It's a fair solution as both of you will receive equal payoffs.");
				}
				else if(vals == 5)
				{
					myOptions.push("Always cooperate by playing 'A' ");	
					myOptions.push("It seems your associate is expecting you to comply with him. He is likely to punish you in in future rounds if you don't. This is okay as you still do better that not cooperating at all.");
				}
				else if(vals == 6)
				{
					myOptions.push("Alternate between the two actions. ");
					myOptions.push("If he is being cooperative, then alternate between (A, B). That way, you get a higher payoff.");
				}
			}
			else if(expertName == 'minmax')
			{
				myOptions.push("Protect yourself! ");
				myOptions.push("Always play 'B'. You are at risk of being exploited so you need to protect yourself.");
			}
			else if(expertName == 'bestResponse')
			{
				myOptions.push("Play along with your associate. If he plays 'A', then reciprocate by playing 'A' too");
				myOptions.push("If he does otherwise, then retaliate by playing 'B'. ");
			}
			else
			{
				myOptions.push("Text not yet implemented for state expert name " + expertName);
			}
		}
		// console.log('^^^^^^^^^^^^^^^^^^^^^done');
		return [myOptions, whyForOptions];
		
	}

	this.getSolutionForRound = function()
	{
		console.log('round is here  ' + recommender.getRound());
		return {'doBetter' : this.howToDoBetter(), 'reason' : this.getReason(), 'reasonOtherwise' : this.getReasonForNotDoingOtherwise(), 'whatAreMyOptions' : this.whatAreMyOptions(), 'recommendation' : this.getRecommendation(), 'opponentInfo' : this.getInformationAboutOpponent(), 'agentChoice' : recommender.latestChoice, 'agentVariables' : recommender.getAgentVariables()};
	}
}
module.exports = RecommenderViewOnGame;