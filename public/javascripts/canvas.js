var AgentStateInfos = function()
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

	this.getStatesText = function(states, recommendation)
	{
		if(!states)
		{
			return '';
		}
		this.setStates(states);
		var stateText = ' ' ; //<p>';
		if(distinctExpertWasChosen)
		{
			stateText += '<p> A distinct expert has been chosen. ';
		}
		if(anExpertHasBeenExecutedForCompleteCycle)
		{
			stateText += '<p> The expert has executed a complete cycle. ';
		}
		if(profitedFromDefection)
		{
			stateText += '<p> The opponent profited from the defection and is thus guilty. ';
		}

		var options = ['A', 'B'];
		stateText += ' <p>Expert Type ' + expertType + '. ';
		if(aspiration)
		{
			aspiration = aspiration.toFixed(3);
		}
		stateText += ' <p>Aspiration ' + aspiration + '. ';
		stateText += ' <p>Target ' + target + '. ';
		stateText += ' <p>Target for opponent ' + targetForOpponent + '. ';
		stateText += '<p> Recommended action : ' + options[recommendation - 1] + ' ';
		stateText += '</p>';

		return stateText;
	}
}


var GameHistory = function(containerDivId, gameHistoryTableId, totalSpanId)
{
	var options = ['A', 'B'];
	var gameHistoryDiv = document.getElementById(gameHistoryTableId);
	var containerDiv = document.getElementById(containerDivId);
	var totalSpan = document.getElementById(totalSpanId);

	var history = []; // player choice, opponent choice, player score
	var myTotalScore = 0;

	this.addToHistory = function(lastHistory)
	{
		history.push([options[lastHistory[0] - 1], options[lastHistory[1] - 1], lastHistory[2]]);
		myTotalScore += lastHistory[2];
	}

	this.getHistory = function()
	{
		return history;
	}

	this.setHistoryDivHtml = function()
	{
		var historyHtml = '<table class="table table-bordered">';
		historyHtml += '<tr><td>Round</td><td>My Choice</td><td>Other Player\'s Choice</td><td>My Score</td></tr>';
		for(var i = history.length - 1; i >= 0; i--)
		{
			historyHtml += ('<tr><td>' + (i + 1) + '</td><td>' + history[i][0]  + '</td><td>'  + history[i][1] + '</td><td>'  + history[i][2] + '</td></tr>');
		}
		historyHtml += '</table>';
		gameHistoryDiv.innerHTML = historyHtml;
		totalSpan.innerHTML = myTotalScore;
		// containerDiv.style.display = 'block';
	}

	this.clearPanel = function()
	{
		containerDiv.innerHTML = '';
	}
}

var Options = function(containerId, playerType, payoffTableId, opPayoffTableId, radioButtonsOnclick)
{
	var optionsName = (playerType == 1) ? 'playerAction' : 'opponentAction';
	var optionsId = (playerType == 1) ? 'playerOption' : 'opponentOption';
	var canvasHtmlId = (playerType == 1) ? 'playerCanvas' : 'opponentCanvas';
	var allPayoffs = [[[-2, 5], [0,0]], [[5, -2], [0,0]]];
	var payoff = allPayoffs[playerType-1];
	var defaultColor;
	

	var getBoxHtml = function()
	{
		lineHtml = '';
		lineHtml += '<tr><td rowspan="4" colspan="1" style="text-align:center;"><br><br>Your  Action <br></td><td rowspan="1" colspan="3">Opponent Action</td></tr>';
    	lineHtml += '<tr><td></td><td>A</td><td>B</td></tr>';
		lineHtml += '<tr><td ><input type="radio" id="myChoice1" name="options">A</input></th><td id"box1"><span style="color: #009"><i>3</i></span>, <span style="color: #900"><i>3</i></span></td><td  id="box2"><span style="color: #009"><i>-2</i></span>, <span style="color: #900"><i>5</i></span></td></tr>';
		lineHtml += '<tr><td><input type="radio" id="myChoice2" name="options">B</input></td><td id="box3"><span style="color: #009"><i>5</i></span>, <span style="color: #900"><i>-2</i></span></td><td  id="box4"><span style="color: #009"><i>0</i></span>, <span style="color: #900"><i>0</i></span></td></tr>';
		lineHtml += '<tr><td></td><td colspan="3">Your points are in blue</td></tr>';

		return lineHtml;
	}

	var getPreviousHtml = function()
	{
		lineHtml = '';
		lineHtml += '<tr><th rowspan="1" colspan="4">Previous Round Score</th></tr>';
    	lineHtml += '<tr><td></td><td>A</td><td>B</td></tr>';
		lineHtml += '<tr><td >A</th><td id="box5"><span><i>3</i></span>, <span><i>3</i></span></td><td  id="box6"><span><i>-2</i></span>, <span><i>5</i></span></td></tr>';
		lineHtml += '<tr><td>B</td><td id="box7"><span><i>5</i></span>, <span><i>-2</i></span></td><td  id="box8"><span><i>0</i></span>, <span><i>0</i></span></td></tr>';

		return lineHtml;
	}

	var getAPayoffTable = function()
	{
		var optionsValues = ['A', 'B'];
		var lineHtml = '<tr>';
		var numberOfColumns = 4;
		var canvasIds = [];
		var optionClasses = ['rcorners1', 'rcorners2'];
		
				

		lineHtml += '</tr>';
		return [lineHtml, canvasIds];
	}

	
	var container = document.getElementById(containerId);
	// var heading = (playerType == 1) ? 'Your Actions' : 'The Other Player\'s Actions';
	var containerHTML = '<table class="table table-bordered" border="1">';
	
	if(playerType == 1)
	{
		containerHTML += getBoxHtml();	
	}	
	else if(playerType == 2)
	{
		containerHTML += getPreviousHtml();
	}
	
	
	containerHTML += '</table>';
	container.innerHTML = containerHTML;


	// get all variables in the container

	// get options
	var options = [];
	options[0] = document.getElementById('myChoice1');
	options[1] = document.getElementById('myChoice2');

	if(playerType == 1)
	{
		options[0].onclick = radioButtonsOnclick(0);
		options[1].onclick = radioButtonsOnclick(1);
	}
	else
	{
		// opponent options for showing result of previous round
		defaultColor = document.getElementById('box5').style.backgroundColor;
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
		console.log('wan pe mi ' + playerType);
		for(var i = 5; i <= 8; i++)
		{
			document.getElementById('box' + i).style.backgroundColor = defaultColor;
		}
	}

}


var CanvasContainer = function(playerOptionHtmlId, opponentOptionHtmlId, myPayoffTableId, opPayoffTableId, socket)
{
	
	var myOptions;
	var opponentOptions; // to now mean the previous round choices
	var submitButton;
	var gameManager;

	this.nextRound = function(forceSubmission, chatBox)
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

		  chatBox.disableAcceptRecommendationButton();

		  socket.emit('clientMessage', {'gamePlay' : val, 'timeOfAction' : 0});
		 
		}
	}

	this.startGame = function(radioButtonsOnclick)
	{
		myOptions = new Options(playerOptionHtmlId, 1, myPayoffTableId, opPayoffTableId, radioButtonsOnclick);
		opponentOptions = new Options(opponentOptionHtmlId, 2);
		opponentOptions.showOptions(false);
	}

	this.showPlayerAndOpponentChoice = function(playerChoice, opponentChoice)
	{
		opponentOptions.returnColorToDefault();	
		var product = playerChoice * opponentChoice;
		var choice = -10; // arbitrary number
		if(product != 2)
		{
			choice = product;
		}
		else
		{
			if(playerChoice == 1)
			{
				choice = 2;
			}
			else
			{
				choice = 3;
			}
		}
		// choice range from 1 to 4
		var id = 'box' + (4 + choice);
		console.log("id is " + id);
		document.getElementById(id).style.backgroundColor = '#FF0000';
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
		opponentOptions.showOptions(true);
		myOptions.showOptions(true);
		myOptions.makeSelection(false);
		myOptions.clearSelection();
		myOptions.returnColorToDefault();
	}

	this.makeSelectionImpossible = function()
	{
		myOptions.makeSelection(true);
	}

	this.setPlayersPayoffText = function()
	{
	
	}

	this.clearPlayersPayoffText = function()
	{
		
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
	var totalWaitingTime = 1;
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
	var totalGameTime = 6000;
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


var GameTimer = function(socket, gameTimeEndFunction)
{
	var totalGameTime = 30;
	var intervalGame = 1000;
	var gameTimePeriodicFunction = function(count, mainCount)
	{
		document.getElementById('timerBegin').innerHTML = count + " secs remaining";
	}

	var that = new TimerFunction(totalGameTime, intervalGame, gameTimePeriodicFunction, gameTimeEndFunction, false);

	return that;
}


var ResultTimer = function(socket, resultTimeEndFunction)
{
	var totalResultTime = 1;
	var intervalResult = 1000;
	
	var resultTimePeriodicFunction = function(count, mainCount)
	{
		document.getElementById('timerBegin').innerHTML = count + " sec" + ((count > 1) ? "s" : "") + " remaining";
	}

	var resultTimeEndFunctionMain = function()
	{
		document.getElementById('timerBegin').innerHTML = "";
		resultTimeEndFunction();
	}

	var that = new TimerFunction(totalResultTime, intervalResult, resultTimePeriodicFunction, resultTimeEndFunctionMain, false);

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

	var adherenceHistory = new AdherenceHistory();
	var chatBox = new ChatBox('chatItems', myCanvasContainer, adherenceHistory);
	var questionsToAsk = new QuestionsToAsk('agentQuestion', 'feedbackQuestion', 'agentQuestionSubmit', 'feedbackSubmit', chatBox);

	var gameManager ;

	var agentVariablesDiv = document.getElementById('informationAlgo');

	agentSettings = new AgentStateSettings();

	var gameTimerEnd = function()
	{
		myCanvasContainer.nextRound(true, chatBox)();
	}

	// waiting Time 
	var waitingTimeElapsed = new WaitingTimeElapsed(socket);

	var gameTimer = new GameTimer(socket, gameTimerEnd);

	

	var resultTimeEndFunction = function()
	{
		
		myCanvasContainer.setSubmitButtonVisible(true);
		myCanvasContainer.resetAll();
		if(hasRecommender)
		{
			document.getElementById('questionAndFeedback').style.visibility = 'visible';
		}
		
	}


	var resultTimer = new ResultTimer(socket, resultTimeEndFunction);


	// create the game manager functions
	var gameManagerEndFunctionFromMain = function()
	{
		myCanvasContainer.nextRound(true, chatBox)();
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

	var radioButtonsOnclick = function(choice)
	{
		return function()
		{
			chatBox.intrudePlayersGame(choice);
		}
	}

	

	var startRealGame = function(hasRecommender)
	{
	  var htmlString = '<div class="alert"><span id="roundNumber" class="pull-left"></span> <span class="pull-right" id="timerBegin"></span></div>';
	  htmlString += "";

	  // htmlString += "<p> <strong class=\"alert alert-success\">Payoff Structure</strong></p>";
	  htmlString += "<div id='myOptions' class='col-sm-8' style='border: 1px solid black'></div>";
  	  htmlString += "<div id='opOptions' class='col-sm-4 well'></div>";
  	  htmlString += "<div class='row'><table class='table'><tr><td id='myPayoff'  style='text-align:left;'></td><td></td><td></td><td id='otherPayoff'  style='text-align:right;'></td></tr></table></div>";
  	  htmlString += "<div id='nextRound' style='text-align: center;'><button class='button' id='nextButton'>Submit</button></div>";
  	  htmlString += "<div style='border: 1px #bce8f1 solid; display: none; font-size: 18px;  text-align: center; background-color: #d9edf7;   margin: 5px;'> <span id=\'timer\'></span> </div>" + "<div class='progress' style='display:none'><div id='progressBarMain' class='progress-bar progress-bar-success progress-bar-striped active' role='progressbar' aria-valuenow='5' aria-valuemin='0' aria-valuemax='100' style='width: 5%;'></div></div>";

	  var actionElement = document.getElementById('actions');
	  actionElement.innerHTML = htmlString;    
	  myCanvasContainer.startGame(radioButtonsOnclick);
	  if(!hasRecommender)
	  {
	  	document.getElementById('chatBoxContainer').style.display = 'none';
	  	document.getElementById('chatBoxContainerLink').style.display = 'none';
	  	// document.getElementById('questionAndFeedback').style.display = 'block';	
	  }
	  if(hasRecommender)
	  {
	  	document.getElementById('questionAndFeedback').style.visibility = 'visible';	
	  }
	  document.getElementById('nextButton').onclick = myCanvasContainer.nextRound(false, chatBox);

	}


	var endGame = function(cummulative, numberOfRounds, playerHadRecommender)
	{
		socket.emit('chatHistory', chatBox.getChattingHistory());
		var htmlString = "<div class=\"alert alert-warning\"> Thank you very much, The game is over. You had a total of " + cummulative  +" points</div>";
        htmlString += "<div class=\"panel panel-default \"><div class=\"panel-heading\"> Please fill in the survey below</div><div class=\"panel-body\">";
        htmlString += postQuizQuestions(playerHadRecommender, cummulative, numberOfRounds);

        htmlString += "</div></div>";
        var actionsElement = document.getElementById('fullPage');
        actionsElement.innerHTML = htmlString;
        document.getElementById('commentBox').innerHTML = '';
	  	// document.getElementById('questionAndFeedback').innerHTML = '';	

	}

	var setAgentVariables = function(content)
	{
		if(content.agentState)
		{
			agentVariablesDiv.innerHTML  = (new AgentStateInfos()).getStatesText(content.agentState.agentVariables, content.recommendation);
		}
		
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
			setAgentVariables(content);
		}
		else if(content.count < content.rounds)
		{
			gameManager.startTimer();
			var briefInfo = content.text;
			var myTotalPayoff = briefInfo.fromItself + briefInfo.fromOpponent;
			gameHistory.addToHistory([briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber, myTotalPayoff])
			myCanvasContainer.makeSelectionImpossible();
		    myCanvasContainer.setOpponentVisible(briefInfo.opponentChoiceInNumber);
		    myCanvasContainer.setPlayerVisible(briefInfo.playerChoiceInNumber);
		    myCanvasContainer.setPlayersPayoffText();
		    myCanvasContainer.showPlayerAndOpponentChoice(briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber);
		    // setAgentState(content.agentState);
		// showPlayerChoicesForGivenTime(reco);
			// document.getElementById('recommender').innerHTML = '';
			resultTimer.startTimer();
			// var agentStates = agentSettings.getAgentStateHtml(content.agentState);
			// document.getElementById('agentState').innerHTML = agentStates;
			document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
			questionsToAsk.moveToNextRound(content);
			document.getElementById('questionAndFeedback').style.visibility = 'hidden';
			gameHistory.setHistoryDivHtml();
			setAgentVariables(content);
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