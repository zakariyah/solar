var AgentStateSettings = function()
{
	var distinctExpertWasChosen, anExpertHasBeenExecutedForCompleteCycle, profitedFromDefection;
	var expertType, aspiration, target, targetForOpponent;
	this.setStates = function(states)
	{
		distinctExpertWasChosen = states[0];
		anExpertHasBeenExecutedForCompleteCycle  = states[1];
		profitedFromDefection = states[2];
		expertType = states[3];
		aspiration = states[4];
		target = states[5];
		targetForOpponent = states[6];
	}

	this.getStatesText = function(states)
	{
		this.setStates(states);
		var stateText = '<p>';
		if(distinctExpertWasChosen)
		{
			stateText += ' A distinct expert has been chosen. ';
		}
		if(anExpertHasBeenExecutedForCompleteCycle)
		{
			stateText += ' The expert has executed a complete cycle. ';
		}
		if(profitedFromDefection)
		{
			stateText += ' The opponent profited from the defection and is thus guilty. ';
		}

		stateText += ' Expert Type ' + expertType + '. ';
		stateText += ' Aspiration ' + aspiration + '. ';
		stateText += ' Target ' + target + '. ';
		stateText += ' Target for opponent ' + targetForOpponent + '. ';
		stateText += '</p>';

		return stateText;
	}
}


var testRecommend = function(player1, agent1, agent2, numberOfTimes)
{
	this.numberOfTimes = numberOfTimes;
	this.player1 = player1;
	this.agent1 = agent1;
	this.agent2 = agent2;
	// this.agent1choices = [];
	// this.agent2choices = [];
	this.agentSettings = new AgentStateSettings();

	this.agent1Payoff = 0;
	this.agent2Payoff = 0;
	this.myM = [];
	this.myM[0] = [];
	this.myM[1] = [];
	this.myM[0][0] = [0.6, 0];
	this.myM[0][1] = [1, 0.2];
	this.myM[1][0] = [0.6, 1];
	this.myM[1][1] = [0, 0.2];
	this.playGame = function()
	{
		// var acts = [];
		for(var i = 0; i < this.numberOfTimes; i++)
		{
			var rec = this.player1.getRecommendation();
			var a = this.agent1.createMove();
			var b = this.agent2.createMove();
			var recVar = this.player1.getRecommenderVariables();
			var toPrint = this.agentSettings.getStatesText(recVar);
			// acts = [a, b];
			this.agent1.update([a, b]);
			this.agent2.update([b, a]);
			this.player1.updateRecommender(a+1,b+1);

			// this.agent1choices.push(a);
			// this.agent2choices.push(b);
			console.log("value "  + [rec-1, a, b] + ' : var; ' + toPrint + '\n');
			this.agent1Payoff += this.myM[0][a][b];
			this.agent2Payoff += this.myM[1][a][b];
		}

		return [this.agent1Payoff, this.agent2Payoff];
	}
}

module.exports = testRecommend;