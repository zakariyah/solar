var Blocker = function()
{
	this.block = function(options)
	{
		for(i in options)
		{
			options[i].style.display = 'none';
		}
	}

	this.unblock = function(options)
	{
		for(i in options)
		{
			options[i].style.display = 'inline';
		}
	}
}


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
		// var historyHtml = '<table class="table table-bordered">';
		// historyHtml += '<tr><td>Round</td><td>My Choice</td><td>Other Player\'s Choice</td><td>My Score</td></tr>';
		// for(var i = history.length - 1; i >= 0; i--)
		// {
		// 	historyHtml += ('<tr><td>' + (i + 1) + '</td><td>' + history[i][0]  + '</td><td>'  + history[i][1] + '</td><td>'  + history[i][2] + '</td></tr>');
		// }
		// historyHtml += '</table>';
		// gameHistoryDiv.innerHTML = historyHtml;
		// totalSpan.innerHTML = myTotalScore;
		// // containerDiv.style.display = 'block';
	}

	this.clearPanel = function()
	{
		containerDiv.innerHTML = '';
	}
}


var OptionButton = function(htmlId1, htmlId2, nextRound)
{	
	var clickedColor = '#00FF00';
	var unClickedColor = '#FFFFFF';
	var but = [document.getElementById(htmlId1), document.getElementById(htmlId2)];
	var isClicked = [false, false];
	var nextRoundFunction = nextRound;
	// alert( '1' + JSON.stringify(nextRound));

	this.getButtons = function()
	{
		return but;
	}

	var butClick = function(butNumber)
	{
		return function()
		{
			// alert('called');
			isClicked[butNumber -1] = true;
			// but[butNumber-1].style.backgroundColor = clickedColor;
			// console.log(JSON.stringify(nextRoundFunction));
			nextRoundFunction(false);
			// isClicked[butNumber -1] = !isClicked[butNumber -1];
			// var col = isClicked[butNumber -1] ? clickedColor : unClickedColor;
			// but[butNumber-1].style.backgroundColor = col;

			// change second to false
			// but[(butNumber) % 2].style.backgroundColor = unClickedColor;
			// isClicked[butNumber %2] = false
		}
	}

	for(var i = 0; i < but.length; i++)
	{
		but[i].onclick = butClick(i+1);
	}
		
	this.reset = function()
	{
		but[0].disabled = false;
		but[1].disabled = false;
		// but[0].style.backgroundColor = '#FFFFFF';
		// but[1].style.backgroundColor = '#FFFFFF';
		isClicked = [false, false];
	}


	this.getSelection = function()
	{
		if(isClicked[0])
			return 1
		else if(isClicked[1])
			return 2
		else
			return 0
	}
	this.enableButtons = function(disable)
	{
		but[0].disabled = disable;
		but[1].disabled = disable;
	}
}

var Options = function(nextRoundFunction)
{
	var cumScore = 0;
	var roundNumber = 0;
	var actionButtons = new OptionButton('yourAction1', 'yourAction2', nextRoundFunction);
	// alert( '2' + JSON.stringify(nextRoundFunction));
	var tags = [document.getElementById('reviewTag'), document.getElementById('actionTag')];	

	var opponentAction = [document.getElementById('opponentAction1'), document.getElementById('opponentAction2')];
	var results = [];

	for(var i = 0; i< 4; i++)
	{
		results.push(document.getElementById('result' + (i+ 1)));	
	} 

	var score = document.getElementById('score');
	var earnings = document.getElementById('earnings');
	var submitButton = document.getElementById('nextButton');

	this.changeBackground = function(opponentChoice)
	{
		// opponentAction[opponentChoice - 1].style.backgroundColor = '#00FF00';
	}

	this.showLastChoice = function(myChoice, opponentChoice)
	{
		var ind = 2 * (myChoice - 1) + opponentChoice;
		results[ind - 1].style.backgroundColor = '#FFFF00';	
	}

	this.getActionButtons = function()
	{
		return actionButtons;
	}

	this.getSelection = function()
	{
		return actionButtons.getSelection();
	}

	this.setScore = function(scoreVal)
	{
	// 		cumScore += scoreVal;
		roundNumber += 1;
		earnings.innerHTML = (scoreVal * 0.01) + ' USD';
	// 		alert(cumScore + ' ' + scoreVal);
		score.innerHTML = Number(scoreVal / roundNumber).toFixed(2);;
	}

	this.makeSelection = function(disable)
	{
		if(disable)
		{
			actionButtons.enableButtons(disable);
		}
	}

	this.showTag = function(tagNo)
	{
		// 0 review, 1 action
		tags[tagNo].style.backgroundColor = '#009900';
		tags[(tagNo + 1) % 2].style.backgroundColor = '#CCCCCC';
	}

	this.clearSelection = function()
	{
		actionButtons.reset();
		for(var i = 0; i< 4; i++)
		{
			results[i].style.backgroundColor =  '#FFFFFF';
		}
		// opponentAction[0].style.backgroundColor =  '#FFFFFF';
		// opponentAction[1].style.backgroundColor =  '#FFFFFF';
		// this.showTag(1);
	}

}


var CanvasContainer = function(socket)
{
	var that2 = this;
	var myOptions;
	// var opponentOptions; // to now mean the previous round choices
	var submitButton;
	var gameManager;
	var score = 0;

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
		  // that.getGameTimer().stopTimer();
		  that.getGameManager().stopTimer();
		  that.setSubmitButtonVisible(false);

		  chatBox.disableAcceptRecommendationButton();
		  
		  var timeOfAction = that.getGameManager().getElapsedTime();
		  socket.emit('clientMessage', {'gamePlay' : val, 'timeOfAction' : timeOfAction});
		  // $.blockUI({ message: '<h1><img src="/images/ajax-loader.gif" /> <p> Moving to next round. Please wait.... </h1>' });
		  (new Blocker()).block(myOptions.getActionButtons().getButtons());
		}
	}

	this.getOptions = function()
	{
		return myOptions;
	}

	this.startGame = function(chatBox)
	{
		// myOptions = new Options(playerOptionHtmlId, 1, myPayoffTableId, opPayoffTableId, radioButtonsOnclick);
		// opponentOptions = new Options(opponentOptionHtmlId, 2);
		// opponentOptions.showOptions(false);
		var that = this;
		myOptions = new Options(this.nextRound(false, chatBox));
	}

	this.showPlayerAndOpponentChoice = function(playerChoice, opponentChoice, roundScore)
	{
		var choice = (opponentChoice - 1) * 2 + playerChoice;
		// choice range from 1 to 4
		var id = 'result' + (choice);
		document.getElementById(id).style.backgroundColor = '#00FF00';
		myOptions.changeBackground(opponentChoice);
		score += roundScore;
		myOptions.setScore(score);
		// // opponentOptions.returnColorToDefault();	
		// myOptions.returnColorToDefault();
		// var product = playerChoice * opponentChoice;
		// var choice = -10; // arbitrary number
		// if(product != 2)
		// {
		// 	choice = product;
		// }
		// else
		// {
		// 	if(playerChoice == 1)
		// 	{
		// 		choice = 2;
		// 	}
		// 	else
		// 	{
		// 		choice = 3;
		// 	}
		// }
		// // choice range from 1 to 4
		// var id = 'box' + (choice);
		// var badgeId = 'badge' + (choice);
		// // console.log("id is " + id);
		// document.getElementById(id).style.backgroundColor = '#FF0000';
		// document.getElementById(badgeId).style.display = 'inline';
	}

	this.getPlayerSelection = function()
	{
		return myOptions.getSelection();
	}

	this.setOpponentVisible = function(selection)
	{
		// opponentOptions.showOptions(true);
		// opponentOptions.setSelection(selection);
	}

	this.setPlayerVisible = function(selection)
	{
		myOptions.showOptions(true);
		myOptions.setSelection(selection);
	}

	this.resetAll = function(myChoice, opponentChoice)
	{
		// opponentOptions.showOptions(true);
		// myOptions.showOptions(true);
		myOptions.makeSelection(false);
		myOptions.clearSelection();
		myOptions.showLastChoice(myChoice, opponentChoice);
		// myOptions.returnColorToDefault();
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

	this.saveChatHistory = function(question, answer, roundNumber)
	{
		socket.emit('saveChatHistory', {question: question, answer:answer, roundNumber : roundNumber});
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
	var elapsedTime;

	var timer = function()
	{
		var now = new Date();
	    // elapsedTime = (now.getTime() - before.getTime());
	    elapsedTime = Math.floor((now.getTime() - before.getTime())/interval); 
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

	this.getElapsedTime = function()
	{
		return elapsedTime;
	}
}

var WaitingTimeElapsed = function(socket)
{
	var totalWaitingTime = 30;
	var intervalWaiting = 1000;
	var waitingTimePeriodicFunction = function(count)
	{
		document.getElementById('timerBegin').innerHTML = count + " second" + ((count > 1) ? "s" : "") + " remaining";
	}

	// var stopWaitingTimeFunction = function()
	// {
	// 	document.getElementById('actionAndReview').style.display = 'block';
	// 	document.getElementById('timerBegin').innerHTML = '';
	// 	console.log('was called b');
	// 	// this.stopTimer();	
	// }

	var waitingTimeEndFunction = function()
	{
		document.getElementById('actionAndReview').style.display = 'block';
		document.getElementById('timerBegin').innerHTML = '';
		console.log('was called b');
		socket.emit('waitingTimeElapsed');
	}

	var that = new TimerFunction(totalWaitingTime, intervalWaiting, waitingTimePeriodicFunction, waitingTimeEndFunction, false);

	return that;
}

var GameManager = function(socket, gameManagerEndFunctionFromMain, endGameFunction)
{
	// 5 mins for the first round and 2 mins for subsequesnt rounds
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
	var totalResultTime = 5;
	var intervalResult = 1000;
	
	var resultTimePeriodicFunction = function(count, mainCount)
	{
		document.getElementById('roundNumber').style.display = 'none';
		document.getElementById('timerBegin').innerHTML = "The next round starts in " + count + " second" + ((count > 1) ? "s" : "");
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
	
	// var socket = io.connect('http://localhost:5000');
	var socket = io.connect('http://ec2-52-88-237-252.us-west-2.compute.amazonaws.com:5000/');
	var myCanvasContainer =  new CanvasContainer(socket);
	var hasRecommender;

	var adherenceHistory = new AdherenceHistory();
	var chatBox = new ChatBox('chatItems', myCanvasContainer, adherenceHistory);
	var questionsToAsk = new QuestionsToAsk('agentQuestion', 'feedbackQuestion', 'agentQuestionSubmit', 'feedbackSubmit', chatBox);

	//for chat button
	var rowChat = document.getElementById('rowChat');

	var gameManager;
	var blocker = new Blocker();
	var agentVariablesDiv = document.getElementById('informationAlgo');

	agentSettings = new AgentStateSettings();

	// var gameTimerEnd = function()
	// {
	// 	myCanvasContainer.nextRound(true, chatBox)();
	// }

	// waiting Time 
	var waitingTimeElapsed = new WaitingTimeElapsed(socket);

	// var gameTimer = new GameTimer(socket, gameTimerEnd);

	var elapsedTimes = [];	

	// var resultTimeEndFunction = function()
	// {
		
	// 	myCanvasContainer.setSubmitButtonVisible(true);
	// 	myCanvasContainer.resetAll();
	// 	if(hasRecommender)
	// 	{
	// 		document.getElementById('questionAndFeedback').style.visibility = 'visible';
	// 	}
		
	// }


	// var resultTimer = new ResultTimer(socket, resultTimeEndFunction);


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
	// myCanvasContainer.getGameTimer = function()
	// {
	// 	return gameTimer;
	// }

	myCanvasContainer.getResultTimer = function()
	{
		return resultTimer;
	}

	myCanvasContainer.getGameManager = function()
	{
		return gameManager;
	}

	// var startGame = function()
	// {
		
	// }

	var radioButtonsOnclick = function(choice)
	{
		return function()
		{
			chatBox.intrudePlayersGame(choice);
		}
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

	var secondToLast = function(content)
	{	
		gameManager.startTimer();
		var briefInfo = content.text;
		// console.log('brief ' + JSON.stringify(content));
		var myTotalPayoff = briefInfo.total;
		var opponentTotal = briefInfo.totalOpponent;
		gameHistory.addToHistory([briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber, myTotalPayoff])
		myCanvasContainer.makeSelectionImpossible();
		myCanvasContainer.showPlayerAndOpponentChoice(briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber, myTotalPayoff);
		document.getElementById('roundNumber').style.display = 'inline';
		document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
		questionsToAsk.moveToNextRound(content, gameHistory.getHistory());
		setAgentVariables(content);
		myCanvasContainer.resetAll(briefInfo.playerChoiceInNumber, briefInfo.opponentChoiceInNumber);		
		document.getElementById('roundNumber').style.display = 'inline';		
	}

	var serverMessage = function(content)
	{	
		// var roundBeforeShowingChat = 1;
		// if(content.count == roundBeforeShowingChat)
		// {
		// 	rowChat.style.display = 'block';
		// }
		if(content.count == 0)
		{
			console.log('was called a');
			waitingTimeElapsed. stopTimer();
			hasRecommender = content.recommenderOptionValue;
			// startRealGame(hasRecommender);
			// console.log('was called 1');
			myCanvasContainer.startGame(chatBox);
			gameManager.startTimer();
			// console.log('was called 2');
			// gameTimer.startTimer();
			//// var agentStates = agentSettings.getAgentStateHtml(content.agentState);
			//// document.getElementById('agentState').innerHTML = agentStates;
			document.getElementById('roundNumber').innerHTML = 'Round ' + (content.count + 1);
			// console.log('was called 3');
			setAgentVariables(content);
			questionsToAsk.moveToNextRound(content, false);
			if(!hasRecommender)
	  		{
				document.getElementById('chatBoxContainer').style.display = 'none';
				document.getElementById('chatBoxContainerLink').style.display = 'none';
	  			document.getElementById('questionAndFeedback').style.display = 'none';	
	  			rowChat.style.display= 'none';
	  		}
	  		else
	  		{
	  			rowChat.style.display = 'block';	
	  		}
	  		document.getElementById('actionAndReview').style.display = 'block';
			document.getElementById('timerBegin').innerHTML = '';
		}
		else if(content.count < content.rounds)
		{
			var elapsedTime = gameManager.getElapsedTime();
			elapsedTimes.push(elapsedTime);
			
			var delay = 0.1;
			if(elapsedTimes.length > 1)
			{
				delay = elapsedTimes[elapsedTimes.length-2] - elapsedTimes[elapsedTimes.length - 1];	
				if(delay < 0)
				{
					delay = 0;
				}
			}
			if(!delay)
			{
				delay = 0;
			}
			// console.log('delay is ' + delay);
			// setTimeout($.unblockUI, 0.5 * 500);
			setTimeout(function(){(new Blocker()).unblock(myCanvasContainer.getOptions().getActionButtons().getButtons());}, 500);
			setTimeout(secondToLast, 0.5 * 500, content);
			// $.unblockUI(); 
		}
		else
		{
			gameHistory.clearPanel();
      		var cummulative = content.cumm;
      		var numberOfRounds = content.rounds;
      		endGame(cummulative, numberOfRounds,hasRecommender)
      		// setTimeout($.unblockUI, 1000);
      		      		setTimeout(function(){(new Blocker()).unblock(myCanvasContainer.getOptions().getActionButtons().getButtons());}, 500);
		}
	}


	var disconnectGame = function(content)
	{
		endGame(content.cummScoreK, content.roundK, hasRecommender);
	}

	socket.on('serverMessage', serverMessage);
	// socket.on('start', startGame);
	socket.on('disconnectMessage', disconnectGame);

	socket.emit('join', hiitNumber);
	
	waitingTimeElapsed.startTimer();
}

pd = new PrisonersDilemma();