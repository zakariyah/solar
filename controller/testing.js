var agen = require('./agent');
var TFT = require('../tester/TFT');
var playgames = require('../tester/playgames');

var A  = [2, 2];
var agent = new agen('S++', 0, A, 0.99, false );
var TFTagent = new TFT();
var game = new playgames(TFTagent, agent, 200);
console.log(game.playGame());


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