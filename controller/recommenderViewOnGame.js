var RecommenderViewOnGame = function(agent)
{
	var recommender = agent;
	var thresholdRound = 5;
	var introHasBeenSaid = false;

	var isPlayerCompliant = function()
	{ // checks to see if the player complied with the recommendation given
		// var playerAct = recommender
		var history = recommender.gameHistory;
		var len = history.length;
		
		if(len == 0)
		{
			return false;
		}
		return recommender.latestChoice == history[len - 1][0];
	}

	var isOpponentCompliant = function()
	{ 
		// checks to check if the opponent 
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
		var choice = options[recommendation];
		var choices = '';
		// introHasBeenSaid = false;
		var stateOfExperts = recommender.getStateOfAgent();
		if(stateOfExperts[0] == 1)
		{
			rec.push("Let us try something different! You might get a better payoff <button class='button'>Explain</button>");
			if(stateOfExperts[3] == 1)
			{
				rec.push("You can both do better than this.");
			}
		}
		else if(stateOfExperts[1] == 1)
		{
			rec.push("Let us quit punishing your associate and try something different.");
			if(stateOfExperts[2] == 1)
			{
				rec.push("You can both do better than this.");
			}
		}
		

		if(round < thresholdRound && (!introHasBeenSaid))
		{
			introHasBeenSaid = true;
			rec.push("In this game, you and your associate can influence one another through your chosen actions. Based on this, I suggest you focus on either: ");
			rec.push("guiding your associate");
			rec.push("following your associate's guidance");
			rec.push("play as you wish for a while, and see how your associate reacts");
			rec.push("focus on minimizing your own loss, regardless of the consequences on your associate");
			rec.push("However play " + choice + " now");
			return rec;			
		}
		else if(round < thresholdRound)
		{
			rec.push('Stick to the recommendation I gave earlier on and let us see how it would play out');
			return rec;
		}

		if(typeOfExpert === 'leader')
		{
			choices = ['Why not try to influence your associate? Chooose ' + choice, 'Try bossing him around by choosing ' + choice];
		}
		else if(typeOfExpert === 'follower')
		{
			choices = ['Choosing  ' + choice + ' helps both of you do well', 'You need to accept a compromise, therefore choose ' + choice];
		}
		else if(typeOfExpert === 'bestResponse')
		{
			var state = '';
			if(recommendation == 0)
			{
				state = 'cooperative';
			}
			else
			{
				state = 'uncooperative';
			}
			choices = ['He has been ' + state + ', so choose ' + choice, 'Your best option is to choose ' + choice];
			// rec.push('You can play independently of your associate; just choose what is best for you');
		}
		else if(typeOfExpert === 'minmax')
		{
			choices = ["Things aren't looking good, Focus on minimizing your own loss by choosing " + choice, "Your associate is exploiting you, Focus on minimizing your own loss by choosing " + choice];
			// rec.push('You might need to protect yourself from loss, play safe!');
		}
		rec.push(chooseOneRandomly(choices));
		return rec;
	}


	this.getRecommendation = function()
	{
		var round = recommender.getRound();
		// var typeOfExpert = recommender.getTypeOfExpert();
		// var recoHtml = getRecommendationHtmlForExpertType(typeOfExpert, round);
		// var options = ['A', 'B'];
		// var recommendation = recommender.latestChoice;
		// var recoHtml = []; // try to capture various emotions. 1.Assertiveness.
		// recoHtml.push('I recommend that you play ' + options[recommendation]);
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var choice = options[recommendation];


		return ''; //recoHtml'';
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
			else if(opponentIsGuilty)
			{
				return 'g';
			}
			else if(isSatisfied)
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
			else if(isSatisfied)
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
			else if(isSatisfied)
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
			else if(isSatisfied)
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

	this.whatAreMyOptions = function()
	{
		var myOptions = [];
		var vals = recommender.presentExpertInformation;
		var expertName = recommender.expertName;
		var round = recommender.getRound();

		console.log('Expert name is  ' + expertName + " " + vals);
		var whyForOptions = [];
		var stateMachine;
		// if(recommender)
		// {
		// 	stateMachine = recommender.getCurrentStateMachine();
		// }
		// else
		// {
		// 	console.log('this. recommender is null');
		// }
		
		var event = 's';

		event = getEventToFire(expertName);
		
		
		// if(expertName == 'leader')
		// {
			
			// if(vals[1] == 1)
			// {
			// 	myOptions.push("Enforce cooperation by always playing 'A'. If your associate does not cooperate, punish him. <button class='button'>Explain</button>");
			// 	// myOptions.push("");
			// 	myOptions.push("It is a fair solution as cooperation will give both of you high and equal payoffs. <button class='button'>Explain</button>");
			// }
			// else if(vals[1] == 2)
			// {
			// 	myOptions.push("Protect yourself, always play 'B' <button class='button'>Explain</button>");
			// 	myOptions.push("You are at risk of being exploited so you need to protect yourself. <button class='button'>Explain</button>");
			// }
			// else if(vals[1] == 3)
			// {
			// 	myOptions.push("Both of you take turns receiving the highest payoff. You do so by playing (B, A) while your associate plays (A,B). If your associate does not cooperate, punish him.");
			// 	myOptions.push("It's a fair solution as both of you will receive high and equal payoffs. <button class='button'>Explain</button>");
			// }
			// else if(vals[1] == 4)
			// {
			// 	myOptions.push("Alternate between the two actions. You do so by playing (A,B) while your associate plays (A,B). If your associate does not cooperate, punish him.");	
			// 	myOptions.push("It's a fair solution as both of you will receive equal payoffs. <button class='button'>Explain</button>");
			// }
			// else if(vals[1] == 5)
			// {
			// 	myOptions.push("If he is being cooperative, then alternate between (A,B)");
			// 	myOptions.push("You deserve a higher payoff if he lets you! <button class='button'>Explain</button>");
			// }
		// }
		
		// else if(expertName == 'follower')
		// {
		// 	if(vals[1] == 1)
		// 	{
		// 		myOptions.push("Always cooperate by playing 'A'.");
		// 		// myOptions.push("");
		// 		myOptions.push("It's a fair solution as cooperation will give both of you high and equal payoffs.<button class='button'>Explain</button>");
		// 	}
		// 	else if(vals[1] == 2)
		// 	{
		// 		myOptions.push("Protect yourself, always play 'B'");
		// 		myOptions.push("You are at risk of being exploited so you need to protect yourself. <button class='button'>Explain</button>");
		// 	}
		// 	else if(vals[1] == 3)
		// 	{
		// 		myOptions.push("Take turns receiving the highest payoff. You do so by playing (B, A) while your associate plays (A,B).");
		// 		myOptions.push("It's a fair solution as both of you will receive high and equal payoffs. <button class='button'>Explain</button>");
		// 	}
		// 	else if(vals[1] == 4)
		// 	{
		// 		myOptions.push("Alternate between the two actions. You do so by playing (A,B) while your associate plays (A,B). If your associate does not cooperate, punish him.");	
		// 		myOptions.push("It's a fair solution as both of you will receive equal payoffs. <button class='button'>Explain</button>");
		// 	}
		// 	else if(vals[1] == 5)
		// 	{
		// 		myOptions.push("Let your associate have his way. Always play 'A' regardless of whatever he plays.");
		// 		myOptions.push("It seems your associate is expecting you to comply with him. He is likely to punish you in future rounds if you don't. <button class='button'>Explain</button>");
		// 	}
		// }

		// console.log('round is ' + round);
		if(round <=  1)
		{
			myOptions.push('The game has just started');
		}
		else
		{
			stateMachine = recommender.getCurrentStateMachine();
			if(expertName == 'minmax')
			{
				myOptions.push("Protect yourself, always play 'B'");
				myOptions.push("You are at risk of being exploited so you need to protect yourself. <button class='button'>Explain</button>");
			}
			else if(expertName == 'leader' | expertName == 'follower' | expertName == 'bestResponse')
			{
				myOptions.push(stateMachine.transition(event));
			}
			// else if(expertName == 'bestResponse')
			// {
			// 	myOptions.push("Expert is BR, text not yet stated");
			// 	myOptions.push("Expert is BR, text not yet stated <button class='button'>Explain</button>");
			// }
			else
			{
				myOptions.push("Text not yet implemented for state expert name " + expertName);
			}	
		}
		
		console.log('my options are ' + myOptions);
		return [myOptions, whyForOptions];
	}

	this.getSolutionForRound = function()
	{
		console.log('round is here  ' + recommender.getRound());
		return {'doBetter' : this.howToDoBetter(), 'reason' : this.getReason(), 'reasonOtherwise' : this.getReasonForNotDoingOtherwise(), 'whatAreMyOptions' : this.whatAreMyOptions(), 'recommendation' : this.getRecommendation(), 'opponentInfo' : this.getInformationAboutOpponent(), 'agentChoice' : recommender.latestChoice, 'agentVariables' : recommender.getAgentVariables()};
	}
}

module.exports = RecommenderViewOnGame;