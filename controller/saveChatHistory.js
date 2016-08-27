var chatHistoryModel = require('../model/chatHistory');
var gameProperties = require('../controller/gameProperties');
// var gameProperties = require('../controller/gameProperties');

var saveChatHistory = function(chatHistory, id)
{
	// var paymentStore = req.body;
	// paymentStore['gameid'] = gameProperties.gameId;
	// payment.createPayment(paymentStore);
	// console.log(chatHistory);
	chatHistoryModel.createChatHistory(gameProperties.gameId, id, chatHistory.question, chatHistory.answer, chatHistory.roundNumber);
};

module.exports = saveChatHistory;