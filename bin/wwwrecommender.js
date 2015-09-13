#!/usr/bin/env node
var debug = require('debug')('my-application');
//var connect = require('connect');
// var restler = require('restler');
var app = require('../app');
var io = require('socket.io');
// var cookieParser = require('cookie-parser');
var connecter = require('../database');
connecter('mongodb://127.0.0.1/scailabexperimentdeception');
var SessionSockets = require('session.socket.io');
var gameController = require('../controller/gameController');
var gameplayer = require('../controller/gameplayer');
var gameProperties = require('../controller/gameProperties');
var playerHiitNumberMap = {};

app.set('port', process.env.PORT || 4000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  console.log('You have logged in ' + app.numberOfTimes + ' times');
});
var ionew = io.listen(server);

sessionSockets = new SessionSockets(ionew, app.sessionstore, app.cookieNew);

var gamecontroller = new gameController(2);
var gameMap = {};
var gameStartStatus = false;
// var answerStores = {};
var numberOfGameControllers = 200;
var gameControllerArray = [];
var numberOfPairs = 0;
var gameCounter = 0;
var firstPlayerJustEntered = true;
var playersSocketDict = {};

var gameTypes = gameProperties.gameTypes; 
ionew.sockets.on('connection', function (socket) {

	socket.on('waitingTimeElapsed', function()
	{
		console.log("was called waiting outside");
			if(!(socket.id in gameMap)) // if player has not been already mapped
			{
				console.log("playerHiitNumberMap[gameCounter ] " + playerHiitNumberMap[gameCounter + "agent"]);
				var player = new gameplayer(gameCounter + "agent", null, true, 1, playerHiitNumberMap[gameCounter + "agent"]); //agents dont have socket
				if(typeof gameControllerArray[gameCounter] === 'undefined')
				{
					return;  // what should be done
				}
				gameControllerArray[gameCounter].addPlayer(player);
				if(gameControllerArray[gameCounter].isFilled())
				{
					startGame();
					firstPlayerJustEntered = true;
					sendMessageAndStart();
				}
					else
				{
					firstPlayerJustEntered = false;
				}
				gameCounter += 1;
			}
			
	});

	socket.on('join', function(hiitNumber)
	{
		if(firstPlayerJustEntered)
		{
			gameControllerArray[gameCounter] = new gameController(2);
			// console.log("something happened here");
		}
		else
		{

		}
		playerHiitNumberMap[socket.id] = hiitNumber; // mapping socketid to hiitNumber.

			// get Game type
			var gameTypeIndex = gameCounter % gameTypes.length;
			var presentGameType = gameTypes[gameTypeIndex];
			startGameTypeForTheNextTwoPlayers(presentGameType);		
	});

	function startGameTypeForTheNextTwoPlayers(gameType)
	{
		// if normal
		if(gameType == 'normal')
		{
			console.log("playerHiitNumberMap[socket.id] 2: " + playerHiitNumberMap[socket.id])
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				console.log("it happened here");
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		else if(gameType == "randomRecommenders")
		{
			// console.log("playerHiitNumberMap[socket.id] 1: " + playerHiitNumberMap[socket.id])
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				// console.log("playersId : " + playersId);
				// console.log("gamePlayers : " + gameControllerArray[gameCounter].gamePlayers);
				for(var playerId in playersId)
				{
					// console.log("playerId : " + playerId);
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		} 
		else if(gameType == "realRecommenders")
		{
			// console.log("playerHiitNumberMap[socket.id] 3: " + playerHiitNumberMap[socket.id])
			var player = new gameplayer(gameCounter, socket, false, 1,playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		else if(gameType == "oneRealRecommender")
		{
			// console.log("playerHiitNumberMap[socket.id] 4: " + playerHiitNumberMap[socket.id])
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
					break;  // to make sure only one has a recommender
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}

		else if(gameType == "oneRandomRecommender")
		{
			// console.log("playerHiitNumberMap[socket.id] 5: " + playerHiitNumberMap[socket.id])
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
					break;  // to make sure only one has a recommender
				}				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		
		playersSocketDict[socket.id] = gameCounter; // dictionary to be used for getting players later on

		if(gameControllerArray[gameCounter].isFilled())
		{
			sendMessageAndStart();
			gameCounter += 1;		
		}

	}

	function startGame()
	{
	
		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers); // createAgentToBeAddedToRooms();

// 		if(!gameStartStatus)
// 		{
			mapOutPlayers(playersId);
			// gameCounter += 1;
	}

	function sendMessageAndStart()
	{
		for(var i in gameControllerArray[gameCounter].gamePlayers)
			{
				console.log(i + " is " + gameMap[i]);
				var message = "Your opponent's id is " + gameMap[i];
				if( !gameControllerArray[gameCounter].gamePlayers[i].isAgent)
				{
					if(gameControllerArray[gameCounter].gamePlayers[i].hasRecommender)
					{
						message += " But don't worry, you have a recommender ";
					}
						var playerToSendMessage = gameControllerArray[gameCounter].gamePlayers[i];
						var roomObject = gameControllerArray[gameCounter].gameRooms[playerToSendMessage.id]; 
						var numberOfRounds = roomObject.getGameRounds();
						// console.log("number of rounds :" + numberOfRounds);
						var recommenderOption = playerToSendMessage.hasRecommender ? 1 : 0;
						var recc = playerToSendMessage.getRecommendation();
						playerToSendMessage.sessionSocket.emit('serverMessage', {count : 0, text : message, rounds : numberOfRounds, recommenderOptionValue : recommenderOption, recommendation : recc});
						playerToSendMessage.sessionSocket.emit('start');
				}
			}
	}

		function mapOutPlayers(playersId)
	{
		
		// console.log("length is " + playersId.length);
		for (var i = 0; i < playersId.length; i++)
		{
			var playerId = playersId[i];
			if(i % 2 == 0)
			{
				gameMap[playerId] = playersId[i + 1]
				gameControllerArray[gameCounter].setPlayersToRoom(playerId, playersId[i + 1] );
			}	
			else
			{
				gameMap[playerId] = playersId[i - 1];
				gameControllerArray[gameCounter].pointSecondPlayerToRoom(playerId, playersId[i - 1], Math.floor(i/2));
			}
		};
	} 


	socket.on('clientMessage', function(content) {
		var options = ['A', 'B'];
		// console.log("was called here 1: " + content);
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		roomNumber =  gameControllerArray[presentSocketGameCounter].roomToSocket[socket.id]; //	roomToSocket[socket.id];
		store = gameControllerArray[presentSocketGameCounter].answerStores[roomNumber];


	if(store)
	{
		var roomObject = gameControllerArray[presentSocketGameCounter].gameRooms[socket.id]; 
		store.addAnswer(content.gamePlay, gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]);
		gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id].setTimeOfAction(content.timeOfAction);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " results</div>";


		if(roomObject.agentPresent)  //if agent is present in the game
		{
			var opponent = gameMap[socket.id];  //get agent id.
			var agentMove = roomObject.player2.nextMove(content.gamePlay);
			store.addAnswer(agentMove, gameControllerArray[presentSocketGameCounter].gamePlayers[opponent]);
			var recc = gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id].getRecommendation();
			var cummScore = store.players[socket.id].getCummulativeValue();
			var message = {count : store.round, text : (messageText  + " " + store.players[socket.id].printResults()), recommendation : recc, rounds : roomObject.getGameRounds(), cumm: cummScore};
			
			// console.log("The message was sent : agent was present");
			socket.emit('serverMessage', message);
			store.clear();
		}

		else // if agent is not present
		{
			if(store.isFilled())
			{					
				// console.log("The message was sent : agent was not present");
				var soc1 = roomObject.player1;
				var soc2 = roomObject.player2;
				if(!soc1.isAgent)
				{ // returns null if it has no recommender and also does nothing in update recommender
					soc1.updateRecommender(store.answererSet[soc1.id].chosenAnswer, store.answererSet[soc2.id].chosenAnswer);
					var cummScore = store.players[soc1.id].getCummulativeValue();
					var message = {count : store.round, text : (messageText  + " " + store.players[soc1.id].printResults()), recommendation : soc1.getRecommendation(), rounds : roomObject.getGameRounds(), cumm : cummScore};
					soc1.sessionSocket.emit('serverMessage', message);						
				}
				else
				{
					// take care of agents !!!	 already taken care of. Just trying to play safe
				}

				if(!soc2.isAgent)
				{
					soc2.updateRecommender(store.answererSet[soc2.id].chosenAnswer, store.answererSet[soc1.id].chosenAnswer);
					var cummScore = store.players[soc2.id].getCummulativeValue();
					var message2 = {count : store.round, text : (messageText  + " " + store.players[soc2.id].printResults()), recommendation : soc2.getRecommendation(), rounds : roomObject.getGameRounds(), cumm :cummScore};
					soc2.sessionSocket.emit('serverMessage', message2);						
				}
				else
				{
					// take care of agents !!!
				}
				store.clear();
			}	
		}
		
	}
});


socket.on('disconnect', function()
{

	var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		else if(typeof gameControllerArray[presentSocketGameCounter] === "undefined")
		{
			// a case where a previous game sends an disconnect message
			return;
		}



	console.log("presentSocketGameCounter : disconnect0:  " + presentSocketGameCounter);
	var roomNumber =  gameControllerArray[presentSocketGameCounter].roomToSocket[socket.id]; //	roomToSocket[socket.id];
	// roomNumber =  gamecontroller.roomToSocket[socket.id]; //	roomToSocket[socket.id];
	var gamePlayerPresent = gameControllerArray[presentSocketGameCounter].gamePlayers;
	if(gamePlayerPresent) // truthy
	{
		if(Object.keys(gamePlayerPresent).length == 1)
		{
			// console.log("here is it");
			gamePlayerPresent[socket.id].connected = false;
			gameControllerArray[presentSocketGameCounter].firstPlayerAlreadyDisconnected = true;
		}
	}
	store = gameControllerArray[presentSocketGameCounter].answerStores[roomNumber];
	// console.log("store is " + store);
	opponentId = gameMap[socket.id];
	if(store)
	{
		console.log("presentSocketGameCounter : disconnect1:  " + presentSocketGameCounter);
	var roomObject = gameControllerArray[presentSocketGameCounter].gameRooms[socket.id]; 
		if(!roomObject.agentPresent)
		{
			if(roomObject.gameRounds <= store.round)
			{
				console.log("round up on here");
				return;
			}
		// console.log("presentSocketGameCounter : disconnect2:  " + presentSocketGameCounter);
		store.addAnswer(0, gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]);
		store.setPlayerConnectedStatusToFalse(socket.id);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " results</div>";
		if(store.isFilled()) //when does this happen !!!
			{	
				console.log('happening when disconnected and filled');
				opponentPlayerObject = gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId];	
				opponentPlayerObject.updateRecommender(store.answererSet[opponentId].chosenAnswer, store.answererSet[socket.id].chosenAnswer);
				var cummScore = store.players[opponentId].getCummulativeValue();
				var message = {count : store.round, text : (messageText  + " " + store.players[opponentId].printResults()), rounds : roomObject.getGameRounds(), cumm:cummScore, recommendation : opponentPlayerObject.getRecommendation()};

				// gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('serverMessage', message);
				gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('disconnectMessage', {cummScoreK : cummScore, roundK : store.round});
				store.clear();
			}
			else
			{ // store is not filled
				console.log("presentSocketGameCounter : disconnect3:  " + presentSocketGameCounter);
				roomObject.gameRounds = store.round;  // set the present round to last round to end the game
			}	
		}
	}
});


socket.on('timeOfAction', function(timeOfAction) { // used to set the time action took place
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		var playerWithTime =  gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]; //	roomToSocket[socket.id];
		playerWithTime.setTimeOfAction(timeOfAction);
		});

});