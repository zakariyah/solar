var ShowAlert = function(header, body)
{
	var modalHeader = document.getElementById('myModalLabel');
	var modalBody = document.getElementById('myModalBody');
	modalHeader.innerHTML = header;
	modalBody.innerHTML = body;
	$(myModal).modal('show')
}


var AgentStateSettings = function()
{	

	this.getRecommendationIndex = function(agentState)
	{
		return agentState.agentChoice;
	}

	this.getOpponentInfoHtml = function(agentState, round)
	{
		var opponentState = agentState.opponentInfo;

		return opponentState;
	}

	this.getRecommendation = function(agentState, round)
	{
		console.log(JSON.stringify(agentState));
		var options = ['A', 'B'];
		var recommendation = agentState.recommendation;
		recommendation.push('<button id="acceptRecommendation'+ round +'" >Click to accept</button>');
		return recommendation; 
	}

	this.getReason = function(agentState)
	{
		return agentState.reason;
	}
	
	this.getReasonProhibitingOtherAction = function(agentState)
	{
		return agentState.reasonOtherwise;
	}
	
	this.getHowToDoBetter = function(agentState)
	{
		return agentState.doBetter;
	}
}

var ChatBox = function(chatItemId, myCanvasContainer)
{
	
	var chatListObject = document.getElementById(chatItemId);
	var contentFromServer;
	var questions = ['Tell me about my opponent', 'What should I do now?', 'Why?', 'Why shouldn\'t I do otherwise?','How do I do better?'];
	var feedbacks = ['You were wrong!', 'You were right'];
	var agentSettings = new AgentStateSettings();
	var roundsAlreadyAsked = {};
	var chatPanelBody = document.getElementById('panelBody');

	var createRoundHeader = function(roundNumber)
	{
		roundsAlreadyAsked[roundNumber] = true;
		var roundHeader = '';
		roundHeader += '<li><div class="col-sm-offset-4 col-sm-4"><div style="background-color: #E6E6FA; border-radius: 25px; text-align: center;" class="well-sm">';
		roundHeader += 'Round ' + (roundNumber + 1);
		roundHeader += '</div></div></li>';

		return roundHeader;
	}

	var createOneChatItem = function(isHuman, header, body, roundNumber)
	{	
		var chatItemHtml = '';
		if(!(roundNumber in roundsAlreadyAsked))
		{
			chatItemHtml += createRoundHeader(roundNumber);
			console.log('chatItemHtml : ' + chatItemHtml);
		}
		var position = isHuman ? 'right' : 'left';
		var bdColor = isHuman ? '#D3FB9f' : '#ffffff';
		chatItemHtml += '<li><div class="' + (isHuman ? 'col-sm-offset-2 ': '') + 'col-sm-10" style="padding: 0px">';
		chatItemHtml += '<div style="background-color: ' +bdColor +';" class="well-sm pull-' + position +'">';
		chatItemHtml += body;
		chatItemHtml += '</div></div></li>';

		return chatItemHtml;
	}

	var acceptRecommendationButtonOnClick = function(thisButton)
	{
		return function()
		{
			var option = agentSettings.getRecommendationIndex(contentFromServer.agentState);
			myCanvasContainer.setPlayerVisible(option + 1);
			thisButton.disabled = true;
		}
	}

	var showChat = function(chatItem, buttonClicked, isQuestion, acceptRecommendation, roundNumber)
	{
		var chatList = (chatListObject.innerHTML + chatItem);
		chatListObject.innerHTML = chatList;
		chatPanelBody.scrollTop = chatPanelBody.scrollHeight;

		if(!isQuestion)
		{
			var snd = new Audio("/audio/videoplayback"); // sound to be played
			snd.play();	
		}
		if(buttonClicked)
		{
			buttonClicked.disabled = false;
		}
		if(acceptRecommendation)
		{
			var acceptRecommendationButton = document.getElementById('acceptRecommendation' + roundNumber);
			acceptRecommendationButton.onclick = acceptRecommendationButtonOnClick(acceptRecommendationButton);
		}
	}

	this.addToChatList = function(question, answer, roundNumber, buttonClicked, acceptRecommendation)
	{
		var chatItem = createOneChatItem(true, 'You', question, roundNumber);
		showChat(chatItem, false, true);

		for(var i = 0 ; i < answer.length; i++)
		{
			chatItem = createOneChatItem(false, 'S-script', answer[i], roundNumber);
			if(i < answer.length - 1)
			{
				setTimeout(showChat, 2000 * (i + 1), chatItem);	
			}
			else
			{
				setTimeout(showChat, 2000 * (i + 1), chatItem, buttonClicked, false, acceptRecommendation, roundNumber);
			}
		}

	}	

	this.updateContentFromServer = function(content)
	{
		contentFromServer = content;
	}

	var getRoundNumber = function()
	{
		return contentFromServer.count;
	}

	var getAnswerToQuestionNumber = function(questionNumber)
	{
		
		if(questionNumber == 0)
		{
			return agentSettings.getOpponentInfoHtml(contentFromServer.agentState, contentFromServer.count);
		}
		else if(questionNumber == 1)
		{
			return agentSettings.getRecommendation(contentFromServer.agentState, contentFromServer.count);
		}
		else if(questionNumber == 2)
		{
			return agentSettings.getReason(contentFromServer.agentState);
		}
		else if(questionNumber == 3)
		{
			return agentSettings.getReasonProhibitingOtherAction(contentFromServer.agentState);
		}
		else if(questionNumber == 4)
		{
			return agentSettings.getHowToDoBetter(contentFromServer.agentState);
		}
	}

	var getAnswerToQuestion = function(questionNumber, isQuestion)
	{
		if(isQuestion)
		{
			return getAnswerToQuestionNumber(questionNumber);
		}
		else
		{
			return getAnswerToFeedbackNumber(questionNumber);
		}
	}
	this.getSolutionToQuestion = function(questionNumber, isQuestion, buttonClicked)
	{
		var question = isQuestion ? questions[questionNumber] : feedbacks[questionNumber];
		var answer = getAnswerToQuestion(questionNumber, isQuestion);	
		var roundNumber = getRoundNumber();
		this.addToChatList(question, answer, roundNumber, buttonClicked, (isQuestion && questionNumber == 1));
	}
}	

var QuestionsToAsk = function(questionId, feedbackId, submitId, feedbackButtonId, chatBox)
{
	var questionCheckBoxes = [];
	var feedbackCheckBoxes = [];
	var questionSelect, feedbackSelect;
	var numberOfQuestions = 5;
	var numberOfFeedback = 2;
	var questionSubmitButton = document.getElementById(submitId);
	var feedbackSubmitButton = document.getElementById(feedbackButtonId);
	
	var enableAllButtons = function()
	{
		for(var i = 0; i < numberOfQuestions; i++)
		{
			questionCheckBoxes[i].disabled = false;
			questionCheckBoxes[i].checked = false;
		}
		for(var i = 0; i < numberOfFeedback; i++)
		{
			feedbackCheckBoxes[i].disabled = false;
			feedbackCheckBoxes[i].checked = false;
		}
	}

	this.moveToNextRound = function(contentFromServer)
	{
		chatBox.updateContentFromServer(contentFromServer);
		enableAllButtons();
	}

	var buttonOnClick = function(isQuestion)
	{		
		return function()
		{
			var questions = [];
			var checkBoxToUse = isQuestion ? questionCheckBoxes : feedbackCheckBoxes; 
			var buttonClicked = isQuestion ? questionSubmitButton : feedbackSubmitButton;
			
			var selectToUse = isQuestion ? questionSelect : feedbackSelect;
			var valueSelected = selectToUse.value;
			if(valueSelected == 0)
			{
				new ShowAlert('Selection Error', 'Please select an option!');
				// alert('Please select an option');
				return;
			}

			buttonClicked.disabled = true;
			checkBoxToUse[valueSelected-1].disabled = true;
			chatBox.getSolutionToQuestion( valueSelected-1, isQuestion, buttonClicked);
			selectToUse.value = '0';
		}
	}

	questionSubmitButton.onclick = buttonOnClick(true);
	feedbackSubmitButton.onclick = buttonOnClick(false);
	console.log(questionSubmitButton);

	for(var i = 0; i < numberOfQuestions; i++)
	{
		var checkBox = document.getElementById(questionId+(i+1));
		questionCheckBoxes.push(checkBox);
	}
	for(var i = 0; i < numberOfFeedback; i++)
	{
		var feedbackCheck = document.getElementById(feedbackId + (i+1));
		feedbackCheckBoxes.push(feedbackCheck);
	}
	questionSelect = document.getElementById('questionSelect');
	feedbackSelect = document.getElementById('feedbackSelect');
}
// #E6E6FA
// #5EFB6E
// Make the chats responsive. Let the message be sent after 2 seconds, read after a second and the result in one second
// Send the timer up.