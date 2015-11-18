var GameHistory = function(containerDivId, gameHistoryTableId, totalSpanId)
{
	var options = ['A', 'B'];
	var gameHistoryDiv = document.getElementById(gameHistoryTableId);
	var containerDiv = document.getElementById(containerDivId);
	var totalSpan = document.getElementById(totalSpanId);

	var history = [];
	var myTotalScore = 0;

	this.addToHistory = function(lastHistory)
	{
		// console.log('last history : ' + lastHistory);
		history.push([options[lastHistory[0] - 1], options[lastHistory[1] - 1], lastHistory[2]]);
		myTotalScore += lastHistory[2];
	}

	this.getHistory = function()
	{
		return history;
	}

	this.setHistoryDivHtml = function()
	{
		// console.log('history ' + history);
		var historyHtml = '<table class="table table-bordered">';
		historyHtml += '<tr><td>Round</td><td>My Choice</td><td>Other Player\'s Choice</td><td>My Score</td></tr>';
		for(var i = history.length - 1; i >= 0; i--)
		{
			historyHtml += ('<tr><td>' + (i + 1) + '</td><td>' + history[i][0]  + '</td><td>'  + history[i][1] + '</td><td>'  + history[i][2] + '</td></tr>');
		}
		historyHtml += '</table>';
		gameHistoryDiv.innerHTML = historyHtml;
		totalSpan.innerHTML = myTotalScore;
		containerDiv.style.display = 'block';
	}

	this.clearPanel = function()
	{
		containerDiv.innerHTML = '';
	}
}

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
		var numberOfColumns = 4;
		var canvasIds = [];
		var optionClasses = ['rcorners1', 'rcorners2'];
		for(var i=0; i<numberOfColumns; i++)
		{
			if(playerType == 1 && i == 1)
			{
				lineHtml += '<td class="'+ optionClasses[lineNumber - 1] +'" width="50" height="30"><input type="radio" name="playerAction" id="playerOption'+lineNumber +'" value="'+lineNumber +'"> <strong style="font-size: 15px;">'+ optionsValues[lineNumber-1] +':</strong></td>';
				continue;
			}
			else if(playerType == 2 && i==numberOfColumns - 2)
			{
				lineHtml += '<td  class="'+ optionClasses[lineNumber - 1] +'"  width="50" height="30"><input type="radio" name="opponentAction" id="opponentOption'+lineNumber +'" value="'+lineNumber +'"> <strong style="font-size: 15px;">'+ optionsValues[lineNumber-1] +':</strong></td>';
				continue;	
			}
			var ind = canvasHtmlId + lineNumber + '' + i;
			var canvasWidth = ((i == 0 || i == numberOfColumns - 1) ? 200 : 100);
			lineHtml += '<td><canvas id="' + ind + '" height="30" width="' + canvasWidth +'"></canvas></td>';
			canvasIds.push(ind);
		}
		lineHtml += '</tr>';
		return [lineHtml, canvasIds];
	}

	var canvasId = [];
	var container = document.getElementById(containerId);
	// var heading = (playerType == 1) ? 'Your Actions' : 'The Other Player\'s Actions';
	var containerHTML = '<table border="1">';
	// containerHTML +=  '<tr><td></td><td></td><td style="text-align:left"><b>' + heading +'</b></td><td></td><td></td></tr>';
	containerHTML += '<tr><td style="text-align:left">Your Payoff</td><td></td><td></td><td  style="text-align:right">Other Player\'s Payoff</td></tr>';
	for(var i = 0; i < 2 ; i++)
	{
		var htmlGot = getALine(i+1);
		canvasId.push(htmlGot[1]);
		containerHTML += htmlGot[0];
	}
	
	containerHTML += '</table>';
	// console.log('container id is ' + containerId);
	container.innerHTML = containerHTML;


	// var payoffTableWordings = (playerType == 1) ? 'Your Payoff: ' : 'The Other Player\'s Payoff: ';
	var recordScores = function(buttonId, payoffTableIdLocal, opPayoffTableIdLocal)
	{
		document.getElementById(payoffTableIdLocal).innerHTML = 'Your Total: ' + (payoff[buttonId][0]) + ' + __';
		document.getElementById(opPayoffTableIdLocal).innerHTML = ''; //: ' + (payoff[buttonId][1]) + ' + __';
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
				canvasses[i].push(new OneCanvas(id, 0, payoff[i][0], playerType));
			}
			else if(j == canvasId[i].length - 1)
			{
				canvasses[i].push(new OneCanvas(id, 1, payoff[i][1], playerType));	
			}
			else
			{
				canvasses[i].push(new StraightLineCanvas(id, playerType));
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

	this.returnColorToDefault = function()
	{
		for(var i = 0; i < canvasses.length; i++)
		{
			for(var j = 0; j < canvasId[i].length; j++)
			{
				canvasses[i][j].returnColorToDefault();
			}
		}
	}


}

var OneCanvas = function(canvasId, position, payoff, playerType)
{
	// position 0 for left and 1 for right
	var canvasElement = document.getElementById(canvasId);
	var canvasContext = canvasElement.getContext("2d");
	var width = canvasElement.width;
	var height = canvasElement.height;
	var chosenColor = playerType == 1 ? "#006400" : "#E9AB17";
	
	canvasContext.fillStyle = "#D3D3D3";
	
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
		canvasContext.fillStyle = chosenColor;
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
		drawTriangle();
		canvasContext.fillStyle = chosenColor;
		canvasContext.fillText(payoff,textStartingX,textStartingY);
	}	

	this.returnColorToDefault = function()
	{
		canvasContext.fillStyle = "#D3D3D3";
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
		drawTriangle();
		canvasContext.fillText(payoff,textStartingX,textStartingY);
	}
}

var StraightLineCanvas = function(canvasId, playerType)
{
	// position 0 for left and 1 for right
	var canvasElement = document.getElementById(canvasId);
	var canvasContext = canvasElement.getContext("2d");
	var width = canvasElement.width;
	var height = canvasElement.height;
	var chosenColor = playerType == 1 ? "#006400" : "#E9AB17";

	canvasContext.fillStyle = "#D3D3D3";
	
	var presentYStart = height / 2;
	var startingY = presentYStart - (height/20);
	var startingX = 0;
	var boxHeight = height/10;
	var boxWidth = width;
	canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);

	this.fillCanvasColor = function()
	{
		canvasContext.fillStyle = chosenColor;
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
	}	

	this.returnColorToDefault = function()
	{
		canvasContext.fillStyle = "#D3D3D3";
		canvasContext.fillRect(startingX,startingY,boxWidth,boxHeight);
	}
}

var CanvasContainer = function(playerOptionHtmlId, opponentOptionHtmlId, myPayoffTableId, opPayoffTableId, socket)
{
	
	var myOptions;
	var opponentOptions;
	var submitButton;
	var gameManager;

	this.nextRound = function(forceSubmission)
	{	
		var that = this;
		return function()
		{
			// alert('eas ewefrgfr');
			var optionSelected = myOptions.getSelection();
			if(optionSelected == 0)
			{
				if(!forceSubmission)
				{
					new ShowAlert('Selection Error', 'Please make a selection before submitting!!');
					// alert('Please make a selection before submitting');
					return;
				}
			}

		  var val = that.getPlayerSelection();
		  that.makeSelectionImpossible();
		  that.getGameTimer().stopTimer();
		  that.getGameManager().stopTimer();
		  that.setSubmitButtonVisible(false);
		  socket.emit('clientMessage', {'gamePlay' : val, 'timeOfAction' : 0});
		  // console.log('emitted');  
		}
	}

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
		myOptions.returnColorToDefault();
		opponentOptions.returnColorToDefault();
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

	this.setSubmitButtonVisible  = function(visibility)
	{
		var submitButton = document.getElementById('nextButton');
		submitButton.style.display = visibility ? 'inline' : 'none';
		submitButton.disabled = !visibility ;
	}

}


var TimerFunction = function(countIn, intervalIn, periodicFunction, endFunction,  decreaseAfterEnd, initialFunction)
{
	if(initialFunction)
	{
		initialFunction();
	}

	var before;
	var count = countIn;
	var interval = intervalIn;
	var mainCount = countIn;
	var counter;
	var decreasingTimeType = decreaseAfterEnd;

	var timer = function()
	{
		var now = new Date();
	    var elapsedTime = (now.getTime() - before.getTime());
	    elapsedTime = Math.floor(elapsedTime/interval); 
	    // leftValue += Math.floor(elapsedTime/interval);
	    count = mainCount - elapsedTime;
	    if (count < 1)
	    {
		    endFunction();
		    clearInterval(counter);
		    if(decreasingTimeType)
		    {
		    	mainCount = mainCount/2;
		    }
		    return;
		}
		periodicFunction(count, mainCount);
	}

	this.startTimer = function()
	{
		before = new Date();
		counter = setInterval(timer, interval);
	}	

	this.stopTimer = function()
	{
		clearInterval(counter);
	}

 }

var WaitingTimeElapsed = function(socket)
{
	var totalWaitingTime = 50;
	var intervalWaiting = 1000;
	var waitingTimePeriodicFunction = function(count)
	{
		document.getElementById('timerBegin').innerHTML = count + " secs remaining";
	}

	var waitingTimeEndFunction = function()
	{

		socket.emit('waitingTimeElapsed');
	}

	var that = new TimerFunction(totalWaitingTime, intervalWaiting, waitingTimePeriodicFunction, waitingTimeEndFunction, false);

	return that;
}

var GameManager = function(socket, gameManagerEndFunctionFromMain, endGameFunction)
{
	var totalGameTime = 120;
	var intervalGame = 1000;
	var agitationStart = 30;
	var numberOfTimes = 0;
	var numberOfAllowedTimes = 2;
	var that;
	var gameManagerPeriodicFunction = function(count, mainCount)
	{
		if(count <= agitationStart)
		{
			var htmlToPrint = "<p>Please make a choice. You have  " + count + " sec" + ((count > 1) ? "s": "") + " remaining</p>";
			document.getElementById('agitationModalBody').innerHTML = htmlToPrint;
		}
		if(count == agitationStart)
		{
			$(agitationModal).modal('show');
		}
		
	}
	

	var  gameManagerEndFunction = function()
	{
		numberOfTimes += 1;
		if(numberOfTimes >= numberOfAllowedTimes)
		{
			var htmlToPrint = "<p>We are sorry. We had to end the game since you were not responding</p>";
			document.getElementById('agitationModalBody').innerHTML = htmlToPrint;
			$(agitationModal).modal('show');
			endGameFunction();
			return;
		}
		gameManagerEndFunctionFromMain();
		$(agitationModal).modal('hide');
	}

	that = new TimerFunction(totalGameTime, intervalGame, gameManagerPeriodicFunction, gameManagerEndFunction, true);

	return that;
}


var GameTimer = function(socket, gameTimeEndFunction, progressbarFunction)
{
	var totalGameTime = 30;
	var intervalGame = 1000;
	var gameTimePeriodicFunction = function(count, mainCount)
	{
		document.getElementById('timerBegin').innerHTML = count + " secs remaining";
		progressbarFunction('progressBarMain', count, mainCount);
	}

	var that = new TimerFunction(totalGameTime, intervalGame, gameTimePeriodicFunction, gameTimeEndFunction, false);

	return that;
}


var ResultTimer = function(socket, resultTimeEndFunction, progressbarFunction)
{
	var totalResultTime = 3;
	var intervalResult = 1000;
	
	var resultTimePeriodicFunction = function(count, mainCount)
	{
		document.getElementById('timerBegin').innerHTML = count + " secs remaining";
		// progressbarFunction('progressBarMain', count, mainCount);
	}

	var that = new TimerFunction(totalResultTime, intervalResult, resultTimePeriodicFunction, resultTimeEndFunction, false);

	return that;
}

var PrisonersDilemma = function()
{	
	var gameHistory = new GameHistory('gameHistory', 'gameHistoryTable', 'myTotalPayoff');
	var hiitNumber = document.getElementById("hiitNumber").innerHTML;
	var socket = io.connect('http://localhost:4000');
	// var socket = io.connect('http://ec2-52-88-237-252.us-west-2.compute.amazonaws.com:4000/');
	var myCanvasContainer =  new CanvasContainer('myOptions', 'opOptions', 'myPayoff', 'otherPayoff', socket);
	var hasRecommender;

	var chatBox = new ChatBox('chatItems', myCanvasContainer);
	var questionsToAsk = new QuestionsToAsk('agentQuestion', 'feedbackQuestion', 'agentQuestionSubmit', 'feedbackSubmit', chatBox);

	var gameManager ;


	agentSettings = new AgentStateSettings();

	var gameTimerEnd = function()
	{
		myCanvasContainer.nextRound(true)();
	}

	var changeProgressBar =  function(barId, rvalue, totalValue)
	{
	  var value = totalValue - rvalue;
	  var ariaNow = value  * 100.0 / totalValue;
	  var progressBar = document.getElementById(barId);
	  progressBar.style.width = Math.floor(ariaNow) + "%";
	}

	// waiting Time 
	var waitingTimeElapsed = new WaitingTimeElapsed(socket);

	var gameTimer = new GameTimer(socket, gameTimerEnd, changeProgressBar);

	

	var resultTimeEndFunction = function()
	{
		myCanvasContainer.clearPlayersPayoffText();
		myCanvasContainer.setSubmitButtonVisible(true);
		myCanvasContainer.clearPlayersPayoffText();
		myCanvasContainer.resetAll();
		// gameTimer.startTimer(); // no more timing for game timer
		if(hasRecommender)
		{
			document.getElementById('questionAndFeedback').style.display = 'block';	
		}
		
	}


	var resultTimer = new ResultTimer(socket, resultTimeEndFunction, changeProgressBar);


	// create the game manager functions
	var gameManagerEndFunctionFromMain = function()
	{
		myCanvasContainer.nextRound(true)();
	}

	var endGameFunction = function()
	{
		socket.emit('forceDisconnect');	
		document.getElementById('fullPage').innerHTML = "";			
	}

	// create the game manager
	gameManager = new GameManager(socket, gameManagerEndFunctionFromMain, endGameFunction);

	

	// add the timers to the game containers
	myCanvasContainer.getGameTimer = function()
	{
		return gameTimer;
	}

	myCanvasContainer.getResultTimer = function()
	{
		return resultTimer;
	}

	myCanvasContainer.getGameManager = function()
	{
		return gameManager;
	}

	var startGame = function()
	{
		
	}

	

	var startRealGame = function(hasRecommender)
	{
	  var htmlString = '<div class="alert alert-warning"><span id="roundNumber" class="pull-left"></span> <span class="pull-right" id="timerBegin"></span></div>';
	  htmlString += "";

	  htmlString += "<p> <strong class=\"alert alert-success\">Payoff Structure</strong></p>";
	  htmlString += "<div id='myOptions' class='row'></div>";
  	  htmlString += "<div id='opOptions' class='row'></div>";
  	  htmlString += "<div class='row'><table class='table'><tr><td id='myPayoff'  style='text-align:left;'></td><td></td><td></td><td id='otherPayoff'  style='text-align:right;'></td></tr></table></div>";
  	  htmlString += "<div id='nextRound' style='text-align: center;'><button class='button' id='nextButton'>Submit</button></div>";
  	  htmlString += "<div style='border: 1px #bce8f1 solid; display: none; font-size: 18px;  text-align: center; background-color: #d9edf7;   margin: 5px;'> <span id=\'timer\'></span> </div>" + "<div class='progress' style='display:none'><div id='progressBarMain' class='progress-bar progress-bar-success progress-bar-striped active' role='progressbar' aria-valuenow='5' aria-valuemin='0' aria-valuemax='100' style='width: 5%;'></div></div>";

	  var actionElement = document.getElementById('actions');
	  actionElement.innerHTML = htmlString;    
	  myCanvasContainer.startGame();
	  if(hasRecommender)
	  {
	  	document.getElementById('chatBoxContainer').style.display = 'block';
	  	document.getElementById('questionAndFeedback').style.display = 'block';	
	  }
	  
	  document.getElementById('nextButton').onclick = myCanvasContainer.nextRound();

	}


	var endGame = function(cummulative, numberOfRounds, playerHadRecommender)
	{
		var htmlString = "<div class=\"alert alert-warning\"> Thank you very much, The game is over. You had a total of " + cummulative  +" points</div>";
        htmlString += "<div class=\"panel panel-default  col-sm-8 col-sm-offset-2 \"><div class=\"panel-heading\"> Please fill in the survey below</div><div class=\"panel-body\">";
        htmlString += postQuizQuestions(playerHadRecommender, cummulative, numberOfRounds);

        htmlString += "</div></div>";
        var actionsElement = document.getElementById('actions');
        actionsElement.innerHTML = htmlString;
        document.getElementById('chatBoxContainer').innerHTML = '';
	  	document.getElementById('questionAndFeedback').innerHTML = '';	
	}

	var serverMessage = function(content)
	{	
		if(content.count == 0)
		{
			waitingTimeElapsed. stopTimer();
			hasRecommender = content.recommenderOptionValue;
			startRealGame(hasRecommender);
			gameManager.startTimer();
			// gameTimer.startTimer();
			//// var agentStates = agentSettings.getAgentStateHtml(content.agentState);
			//// document.getElementById('agentState').innerHTML = agentStates;
			document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
			questionsToAsk.moveToNextRound(content);
		}
		else if(content.count < content.rounds)
		{
			gameManager.startTimer();
			// console.log('content ' + JSON.stringify(content));
			var briefInfo = content.text;
			var myTotalPayoff = briefInfo.fromItself + briefInfo.fromOpponent;
			gameHistory.addToHistory([briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber, myTotalPayoff])
			myCanvasContainer.makeSelectionImpossible();
		    myCanvasContainer.setOpponentVisible(briefInfo.opponentChoiceInNumber);
		    myCanvasContainer.setPlayerVisible(briefInfo.playerChoiceInNumber);
		    myCanvasContainer.setPlayersPayoffText();
		    // setAgentState(content.agentState);
		// showPlayerChoicesForGivenTime(reco);
			// document.getElementById('recommender').innerHTML = '';
			resultTimer.startTimer();
			// var agentStates = agentSettings.getAgentStateHtml(content.agentState);
			// document.getElementById('agentState').innerHTML = agentStates;
			document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
			questionsToAsk.moveToNextRound(content);
			document.getElementById('questionAndFeedback').style.display = 'none';
			gameHistory.setHistoryDivHtml();
		}
		else
		{
			gameHistory.clearPanel();
      		var cummulative = content.cumm;
      		var numberOfRounds = content.rounds;
      		endGame(cummulative, numberOfRounds,hasRecommender)
		}
	}


	var disconnectGame = function(content)
	{
		endGame(content.cummScoreK, content.roundK, hasRecommender);
	}

	socket.on('serverMessage', serverMessage);
	socket.on('start', startGame);
	socket.on('disconnectMessage', disconnectGame);


	socket.emit('join', hiitNumber);
	
	waitingTimeElapsed.startTimer();
}

pd = new PrisonersDilemma();

// fix the progress progress-bar
// look at all possibilities
// read dynamic programming
// fix the alert dialog

// test the accordion itself
// bNcmE8oz
// bili41990@yahoo.com