var Options = function(containerId, playerType, payoffTableId, opPayoffTableId)
{
	var optionsName = (playerType == 1) ? 'playerAction' : 'opponentAction';
	var optionsId = (playerType == 1) ? 'playerOption' : 'opponentOption';
	var canvasHtmlId = (playerType == 1) ? 'playerCanvas' : 'opponentCanvas';
	var allPayoffs = [[[-2, 5], [0,0]], [[5, -2], [0,0]]];
	var payoff = allPayoffs[playerType-1];




	var getALine = function(lineNumber)
	{
		var optionsValues = ['A', 'B'];
		var lineHtml = '<tr>';
		var numberOfColumns = 5;
		var canvasIds = [];
		var optionClasses = ['rcorners1', 'rcorners2'];
		for(var i=0; i<numberOfColumns; i++)
		{
			if(playerType == 1 && i == 1)
			{
				lineHtml += '<td class="'+ optionClasses[lineNumber - 1] +'" width="50" height="30"><input type="radio" name="playerAction" id="playerOption'+lineNumber +'" value="'+lineNumber +'"> <strong style="font-size: 15px;">'+ optionsValues[lineNumber-1] +':</strong></td>';
				continue;
			}
			else if(playerType == 2 && i==3)
			{
				lineHtml += '<td  class="'+ optionClasses[lineNumber - 1] +'"  width="50" height="30"><input type="radio" name="opponentAction" id="opponentOption'+lineNumber +'" value="'+lineNumber +'"> <strong style="font-size: 15px;">'+ optionsValues[lineNumber-1] +':</strong></td>';
				continue;	
			}
			var ind = canvasHtmlId + lineNumber + '' + i;
			lineHtml += '<td><canvas id="' + ind + '" height="30" width="200"></canvas></td>';
			canvasIds.push(ind);
		}
		lineHtml += '</tr>';
		return [lineHtml, canvasIds];
	}


	var canvasId = [];
	var container = document.getElementById(containerId);
	var heading = (playerType == 1) ? 'Your Actions' : 'The Other Player\'s Actions';
	var containerHTML = '<table border="1"><tr><td></td><td></td><td style="text-align:left"><b>' + heading +'</b></td><td></td><td></td></tr>';
	containerHTML += '<tr><td style="text-align:left">Your Payoff</td><td></td><td></td><td></td><td  style="text-align:right">Other Player\'s Payoff</td></tr>';
	for(var i = 0; i < 2 ; i++)
	{
		var htmlGot = getALine(i+1);
		canvasId.push(htmlGot[1]);
		containerHTML += htmlGot[0];
	}
	
	containerHTML += '</table>';
	console.log('container id is ' + containerId);
	container.innerHTML = containerHTML;


	// var payoffTableWordings = (playerType == 1) ? 'Your Payoff: ' : 'The Other Player\'s Payoff: ';
	var recordScores = function(buttonId, payoffTableIdLocal, opPayoffTableIdLocal)
	{
		document.getElementById(payoffTableIdLocal).innerHTML = 'Sum: ' + (payoff[buttonId][0]) + ' + __';
		document.getElementById(opPayoffTableIdLocal).innerHTML = 'Sum: ' + (payoff[buttonId][1]) + ' + __';
	}

	// onclick handler for radio buttons
	var onClickHandler = function(buttonId)
	{	
		return function()
		{
			for(var i = 0; i < canvasses.length; i++)
			{
				for(var j = 0; j < canvasses[i].length; j++)
				{
					if(i == buttonId)
					{
						canvasses[i][j].fillCanvasColor();
					}	
					else
					{
						canvasses[i][j].returnColorToDefault();
					}
				}
			}
			if(playerType == 1)
			{
				recordScores(buttonId, payoffTableId, opPayoffTableId);	
			}
			
		}
	}

	// get all variables in the container

	// get options
	var options = [];
	options[0] = document.getElementById(optionsId + '1');
	options[0].onclick = onClickHandler(0, payoffTableId);
	options[1] = document.getElementById(optionsId + '2');
	options[1].onclick = onClickHandler(1, payoffTableId);

	
	// make the canvasses
	var canvasses = [[], []];
	for(var i = 0; i < canvasses.length; i++)
	{
		for(var j = 0; j < canvasId[i].length; j++)
		{
			var id = canvasId[i][j];
			if(j == 0)
			{
				canvasses[i].push(new OneCanvas(id, 0, payoff[i][0]));
			}
			else if(j == canvasId[i].length - 1)
			{
				canvasses[i].push(new OneCanvas(id, 1, payoff[i][1]));	
			}
			else
			{
				canvasses[i].push(new StraightLineCanvas(id));
			}
		}
	}

	if(playerType == 2)
	{
		options[0].disabled = true;
		options[1].disabled = true;
	}

	this.getSelection = function()
	{
		var selection = 0;
		for(var i = 0; i < options.length; i++)
		{
			if(options[i].checked)
			{
				return i+1;
			}
		}
		return selection;
	}

	this.getSelectionValueForSelfAndOpponent = function()
	{
		var selection = this.getSelection();
		if(selection == 0)
		{
			return null;
		}
		return payoff[selection-1];
	}

	this.setSelection = function(selection)
	{ // 1 for A and 2 for B
		options[selection - 1].checked = true;
		(onClickHandler(selection-1, payoffTableId, opPayoffTableId))();
	}

	this.clearSelection = function()
	{
		options[0].checked = false;
		options[1].checked = false;
	}

	this.showOptions = function(show)
	{
		document.getElementById(containerId).style.display = show ? 'block' : 'none';
	}

	this.makeSelection = function(availability)
	{
		options[0].disabled = availability;
		options[1].disabled = availability;
	}

}

var OneCanvas = function(canvasId, position, payoff)
{
	// position 0 for left and 1 for right
	var canvasElement = document.getElementById(canvasId);
	var canvasContext = canvasElement.getContext("2d");
	var width = canvasElement.width;
	var height = canvasElement.height;
	var chosenColor = position == 0 ? "#FF0000" : "#FF00FF";
	
	canvasContext.fillStyle = "#303030";
	
	var presentYStart = height / 2;
	var startingY = presentYStart - (height/20);
	var startingX = (position == 0) ? width/2 : 0;
	var boxHeight = height/10;
	var boxWidth = width/2;
	canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);

	// draw triangle
	var drawTriangle = function()
	{
		canvasContext.beginPath();
		canvasContext.moveTo((position == 0) ? 3*width/8 : 5*width/8, presentYStart);
		canvasContext.lineTo(width/2 , presentYStart + (height/5));
		canvasContext.lineTo(width/2 , presentYStart - (height/5));
		canvasContext.closePath();
		canvasContext.fill();	
	}
	
	drawTriangle();
	// write text
	var textStartingX = (position == 0) ? width/4 : 3*width/4;
	var textStartingY = presentYStart + 10;
	canvasContext.font = "bold 20px Arial";
	canvasContext.fillText(payoff,textStartingX,textStartingY);
	
	this.fillCanvasColor = function()
	{
		canvasContext.fillStyle = "#0000FF";
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
		drawTriangle();
		canvasContext.fillStyle = chosenColor;
		canvasContext.fillText(payoff,textStartingX,textStartingY);
	}	

	this.returnColorToDefault = function()
	{
		canvasContext.fillStyle = "#303030";
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
		drawTriangle();
		canvasContext.fillText(payoff,textStartingX,textStartingY);
	}
}


var StraightLineCanvas = function(canvasId)
{
	// position 0 for left and 1 for right
	var canvasElement = document.getElementById(canvasId);
	var canvasContext = canvasElement.getContext("2d");
	var width = canvasElement.width;
	var height = canvasElement.height;
	
	canvasContext.fillStyle = "#303030";
	
	var presentYStart = height / 2;
	var startingY = presentYStart - (height/20);
	var startingX = 0;
	var boxHeight = height/10;
	var boxWidth = width;
	canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);

	this.fillCanvasColor = function()
	{
		canvasContext.fillStyle = "#0000FF";
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
	}	

	this.returnColorToDefault = function()
	{
		canvasContext.fillStyle = "#303030";
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
	}
}


var canvasContainer = function(playerOptionHtmlId, opponentOptionHtmlId, myPayoffTableId, opPayoffTableId)
{
	
	var myOptions;
	var opponentOptions;

	this.startGame = function()
	{
		myOptions = new Options(playerOptionHtmlId, 1, myPayoffTableId, opPayoffTableId);
		opponentOptions = new Options(opponentOptionHtmlId, 2);
		opponentOptions.showOptions(false);
	}

	this.getPlayerSelection = function()
	{
		return myOptions.getSelection();
	}

	this.setOpponentVisible = function(selection)
	{
		opponentOptions.showOptions(true);
		opponentOptions.setSelection(selection);
	}

	this.setPlayerVisible = function(selection)
	{
		myOptions.showOptions(true);
		myOptions.setSelection(selection);
	}

	this.resetAll = function()
	{
		opponentOptions.showOptions(false);
		myOptions.showOptions(true);
		myOptions.makeSelection(false);
		myOptions.clearSelection();
		opponentOptions.clearSelection();
	}

	this.makeSelectionImpossible = function()
	{
		myOptions.makeSelection(true);
	}

	this.setPlayersPayoffText = function()
	{
		var fromMe = myOptions.getSelectionValueForSelfAndOpponent();
		var fromOp = opponentOptions.getSelectionValueForSelfAndOpponent();
		if(fromMe && fromOp)
		{
			document.getElementById(myPayoffTableId).innerHTML = 'Sum: ' + fromMe[0] + ' + ' + fromOp[0] + ' = ' + (fromMe[0] + fromOp[0]);
			document.getElementById(opPayoffTableId).innerHTML = 'Sum: ' + fromMe[1] + ' + ' + fromOp[1] + ' = ' + (fromMe[1] + fromOp[1]);
		}
	}

	this.clearPlayersPayoffText = function()
	{
		document.getElementById(myPayoffTableId).innerHTML = '';
		document.getElementById(opPayoffTableId).innerHTML = '';
	}


}

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

// canvasContainerT = new canvasContainer('myOptions', 'opOptions', 'myPayoff', 'otherPayoff');
// canvasContainerT.startGame();
// canvasContainerT.setOpponentVisible(1);
// canvasContainerT.setPlayersPayoffText();


// expert values

agentSettings = new AgentStateSettings();