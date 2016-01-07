var agen = require('./agent');
var RecommenderViewOnGame = require('./recommenderViewOnGame.js');
var TFT = require('../tester/TFT');
var randAgent = require('../tester/randAgent');
var playgames = require('../tester/playgames');
var player = require('./gameplayer');
var testRecommend = require('../tester/testRecommend');


var A  = [2, 2];
var agent = new agen('S++', 0, A, 0.99, false );
var agent2 = new agen('S++', 0, A, 0.99, false );
var TFTagent = new TFT();
var randA = new randAgent();

var recView = new RecommenderViewOnGame(agent.myJefePlus);
// var game = new playgames(agent2, agent, 200);
// console.log(game.playGame());



var soc = {id: 'rfyrfuyfruyfuy67565'};
player1 = new player(12, soc, false, 1, 656576);
player1.setHasRecommender(false);


var testRecommend = new testRecommend(TFTagent, 200, 0.7);
console.log(testRecommend.playGame());


// var previousMove = 1;
// for(var i = 0; i< 10; i++)
// {
// 	var agentMove = agent.createMove();
// var opponentMove = 1; //previousMove ;
// var acts = [agentMove, opponentMove];
// agent.update(acts);
// previousMove = agentMove;
// console.log(i + ', ' + acts);		
// }

// what the value of the target solution
// guilt