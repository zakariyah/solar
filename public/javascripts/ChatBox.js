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

	this.getStatesText = function(agentState)
	{
		if(!agentState)
		{
			return '';
		}
		this.setStates(agentState.agentVar);
		var stateText = ' ' ; //<p>';
		if(distinctExpertWasChosen)
		{
			stateText += 'A distinct expert has been chosen. ';
		}
		if(anExpertHasBeenExecutedForCompleteCycle)
		{
			stateText += 'The expert has executed a complete cycle. ';
		}
		if(profitedFromDefection)
		{
			stateText += 'The opponent profited from the defection and is thus guilty. ';
		}

		stateText += 'Expert Type ' + expertType + '. ';
		if(aspiration)
		{
			aspiration = aspiration.toFixed(3);
		}
		stateText += 'Aspiration ' + aspiration + '. ';
		stateText += 'Target ' + target + '. ';
		stateText += 'Target for opponent ' + targetForOpponent + '. ';
		// stateText += 'Recommended action : ' + options[recommendation - 1] + ' ';
		// stateText += '</p>';

		return stateText;
	}

	this.getOpponentInfoHtml = function(agentState)
	{
		var opponentState = agentState.opponentState;
		var reciprocity = opponentState[0];
		var niceness = opponentState[1];
		var bully = opponentState[2];

		var info = '<p>Reciprocity : ' + reciprocity + '%';
		info += '<p>Niceness : ' + niceness + '';
		info += '<p>Bully : ' + bully + '%';
		return info;
	}

	this.getRecommendation = function(agentState)
	{
		console.log(JSON.stringify(agentState));
		var options = ['A', 'B'];
		return 'Recommended action : ' + options[agentState.agentChoice] + ' '; 
	}

	this.getReason = function(agentState)
	{
		return 'reason';
	}
	
	this.getReasonProhibitingOtherAction = function(agentState)
	{
		return 'reason for not doing otherwise';
	}
	
	this.getHowToDoBetter = function(agentState)
	{
		return 'how to do better';
	}
}

var ChatBox = function(chatItemId)
{
	var chatListObject = document.getElementById(chatItemId);
	var contentFromServer;
	var questions = ['Tell me about my opponent', 'What should I do now?', 'Why?', 'Why shouldn\'t I do otherwise?','How do I do better?'];
	var feedbacks = ['You were wrong!', 'You were right'];
	var agentSettings = new AgentStateSettings();

	var createOneChatItem = function(isHuman, header, body, roundNumber)
	{
		var position = isHuman ? 'right' : 'left';
		var bdColor = isHuman ? '#edf7d9' : '#d9edf7';
		var chatItemHtml = '<li><div class="' + (isHuman ? 'col-sm-offset-2 ': '') + 'col-sm-10">';
		chatItemHtml += '<div style="background-color: ' +bdColor +'; border-bottom: 5px #ffffff solid;" class="pull-' + position +'">';
		chatItemHtml += body;
		chatItemHtml += '</div></li>';
		// var chatItemHtml = '<li class="' + position + ' clearfix">';
		// chatItemHtml += '<span class="chat-img pull-' + position + '">';
		// chatItemHtml += '<img ' + (isHuman ? 'src="http://placehold.it/50/55C1E7/fff&text=U"': 'src="http://placehold.it/50/55C1E7/fff&text=S"') + ' alt="User Avatar" class="img-circle" /></span>';
		// chatItemHtml += '<div class="chat-body clearfix"><div class="header">';
		// if(isHuman)
		// {
		// 	chatItemHtml += '<strong class="primary-font">' + header + '</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>Round '+ (roundNumber + 1) +'</small>';
		// }
		// else
		// {
		// 	chatItemHtml += '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>Round ' + roundNumber+'</small><strong class="pull-right primary-font">'+ header +'</strong>';
		// }

		// chatItemHtml += '</div><p>';
		// chatItemHtml += body;
		// chatItemHtml += '</p></div></li>';



		return chatItemHtml;
	}

	this.addToChatList = function(question, answer, roundNumber)
	{
		var chatItem = createOneChatItem(true, 'You', question, roundNumber);
		chatItem += createOneChatItem(false, 'S-script', answer, roundNumber);
		var chatList = (chatListObject.innerHTML + chatItem);
		chatListObject.innerHTML = chatList;
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
			return agentSettings.getOpponentInfoHtml(contentFromServer.agentState);
		}
		else if(questionNumber == 1)
		{
			return agentSettings.getRecommendation(contentFromServer.agentState);
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
	this.getSolutionToQuestion = function(questionNumber, isQuestion)
	{
		var question = isQuestion ? questions[questionNumber] : feedbacks[questionNumber];
		var answer = getAnswerToQuestion(questionNumber, isQuestion);	
		var roundNumber = getRoundNumber();
		this.addToChatList(question, answer, roundNumber);
	}
}	

var QuestionsToAsk = function(questionId, feedbackId, submitId, feedbackButtonId, chatBox)
{
	var questionCheckBoxes = [];
	var feedbackCheckBoxes = [];
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
			for(var i = 0; i < checkBoxToUse.length; i++)
			{
				if(checkBoxToUse[i].checked)
				{
					if(!checkBoxToUse[i].disabled)
					{
						questions.push(i);
						checkBoxToUse[i].disabled = true;
					}
				}
			}

			for(var i = 0; i < questions.length; i++)
			{
				chatBox.getSolutionToQuestion(questions[i], isQuestion);
			}
			// console.log('was called');
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

}

// var chatBox = new ChatBox('chatItems');
// var questionsToAsk = new QuestionsToAsk('agentQuestion', 'feedbackQuestion', 'agentQuestionSubmit', 'feedbackSubmit', chatBox);
// chatBox.addToChatList('Why', 'It is the best option now', 2);

// put the timer beside the round
// fix the roundNumber disparity in the chat
// Beautify the chatBox
// fix the words generated
//  show to Dr. Jacob