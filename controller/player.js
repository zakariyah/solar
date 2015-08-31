function player(id)
{
	this.id = id;
	this.gameChoices = ["A", "B"];
	this.connected = true;
	this.history = [];
	this.addToHistory =  function(arrayOfValues){
		this.history.push(arrayOfValues) //[choice, value, opponentchoice, opponentvalue]);
		// console.log("after pushing: " + this.history.length);
	};

	var gameProperties = require('../controller/gameProperties');
	this.gameMatrix = gameProperties.gameMatrix;
	this.getCummulativeValue = function()
	{
		cummulative = 0;
		for(var i = 0; i < this.history.length; i++)
		{
			cummulative += this.history[i][1];
		}
		return cummulative;
	};

	this.getOpponentCummulativeValue = function()
	{
		cummulative = 0;
		for(var i = 0; i < this.history.length; i++)
		{
			cummulative += this.history[i][3];
		}
		return cummulative;
	};

	this.printResults = function()
	{
	var color1 = " label-danger";
	html = "<table class=\"table table-bordered\"><tr><td>Round</td><td>Your Choice </td> <td>Agent Choice </td> <td> Your score </td></tr>";
		html += " <tr><td colspan=3> <h3><span class=\"label label-primary\">CUMMULATIVE SCORE </span></h3></td><td>" +
		"<h3><span class=\"label " + color1 + "\">" + this.getCummulativeValue() +
		        "</span></h3></td></tr>";
		// console.log("len: " + this.history.length);
		var randomBadge = "<span class=\"badge  pull-right\">R</span>";
		var color1 = (this.getCummulativeValue() > this.getOpponentCummulativeValue()) ? " label-info " : " label-danger";
		var color2 = (this.getCummulativeValue() < this.getOpponentCummulativeValue()) ? " label-info " : " label-danger";
		toBeAddedAll = "";
		for(var i = 0; i < this.history.length; i++)
		{
			toBeAdded = " <tr><td>"+ (i + 1) + "</td><td>" + this.gameChoices[this.history[i][0] - 1] + " " +
				((this.history[i][4] == 0) ? randomBadge : "") +
			"</td><td>" + this.gameChoices[this.history[i][2] - 1] + " " +
			((this.history[i][5] == 0) ? "" : "") +	
			"</td><td>" + this.history[i][1] + "</td></tr>";			
			toBeAddedAll = toBeAdded + toBeAddedAll;
		}
		html += toBeAddedAll;
		html += "</table>";

		var briefAnswer = "";
		var lastIndex = this.history.length - 1;
		var playerChoice = this.gameChoices[this.history[lastIndex][0] - 1];
		var opponentChoice = this.gameChoices[this.history[lastIndex][2] - 1];
		var playerGotFromItself = this.gameMatrix[this.history[lastIndex][0] - 1][0];
		var playerGotFromOpponent = this.gameMatrix[this.history[lastIndex][2] - 1][1];
		var total = playerGotFromItself + playerGotFromOpponent;
		var playerChoiceWasRandom = (this.history[lastIndex][4] == 0);
		var randomLabel = playerChoiceWasRandom ? "<span class=\"badge  pull-right\">R</span>" : "";
		briefAnswer += "<table class='table table-bordered'><tr><td></td><td></td><td> You got</td></tr>";
		briefAnswer += "<tr><td>Your Choice : </td><td>" + playerChoice + randomLabel + "</td><td>" + playerGotFromItself+"</td></tr>";
		briefAnswer += "<tr><td>Agent Choice : </td><td>" + opponentChoice+ "</td><td>" + playerGotFromOpponent +"</td></tr>";
		briefAnswer += "<tr><td>Total</td><td></td><td>" + total + "</td></tr></table>";
		// if(this.history[lastIndex][4] == 0)
		// {
		// 	briefAnswer += "";
		// 	briefAnswer += "<div class=\"alert alert-success\">You did not choose anything. Thus a random choice of " + this.gameChoices[this.history[lastIndex][0] - 1] + 
		// 	" was generated for you. </div><div class=\"alert alert-success\"> The other player chose " + this.gameChoices[this.history[lastIndex][2] - 1] +". </div><div class=\"alert alert-success\">Therefore you got ";
		// 	briefAnswer += this.history[lastIndex][1] + " points </div>"; 
		// }
		// else
		// {
		// 	briefAnswer += 	"<div class=\"alert alert-success\">You chose " + this.gameChoices[this.history[lastIndex][0] - 1] + " </div><div class=\"alert alert-success\">The other player chose " + this.gameChoices[this.history[lastIndex][2] - 1] +".</div><div class=\"alert alert-success\"> Therefore you got ";
		// 	briefAnswer += this.history[lastIndex][1] + " points</div>"; 
		// }
		
		briefAnswer += "<p id='nextRoundCounter'> Next round starts in 10 seconds</p>";
		briefAnswer += "<div class='progress'><div id='progressBar' class='progress-bar progress-bar-striped progress-bar-danger active' role='progressbar' aria-valuenow='5' aria-valuemin='0' aria-valuemax='100' style='width: 5%;'></div></div>";
		// html += " <tr><td colspan=3> <h3><span class=\"label label-primary\">CUMMULATIVE SCORES </span></h3></td><td>" +
		// "<h3><span class=\"label " + color1 + "\">" + this.getCummulativeValue() +
		//         "</span></h3></td><td><h3><span class=\"label "+ color2 +" \">" + this.getOpponentCummulativeValue() + "</span></h3></td></tr></table>";
		return  briefAnswer;
	};
}

module.exports = player;
