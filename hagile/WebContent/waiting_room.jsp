<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,ae.ac.masdar.labs.scai.hagile.*,java.net.URLEncoder" %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Waiting Room</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<table class="phasetable"><tr><td class="indicateactivephase">WAITING ROOM</td></tr></table>

<%
	String idPlayer = request.getParameter("playerId");
	if(!Constants.FULL_INTRO) {
		if(idPlayer == null) idPlayer = request.getParameter("workerId");
	} else if(!"post".equalsIgnoreCase(request.getMethod())) {
		Utilities.redirectError("Invalid method",request,response,getServletContext());
		return;
	}
	Boolean contactable = null;
	if(request.getParameter("contactable") != null) {
		contactable = "yes".equalsIgnoreCase(request.getParameter("contactable"));
	}
	dbconn = DatabaseConnection.getInstance();
	PlatformAPI api = PlatformAPI.getInstance();
	Configuration conf = Configuration.getInstance();
	//Get Parameters
	String idHit = request.getParameter("hitId");
	String idAssignment = request.getParameter("assignmentId");
	if(idHit == null || api.getReward(idHit) < 0) {
		Utilities.redirectError("Invalid HIT ["+idHit+"]",request,response,getServletContext());
		return;
	}
	if(idAssignment != null && idHit != null && idPlayer != null) {
		if(request.getParameter("countdownTimer") == null) {
	Utilities.logInfo("["+idPlayer+"] on ["+idAssignment+"] in waiting room.");
	//Expire the task if we don't have more than the estimated maximum per-game payout across all active games
	api.expireIfBalanceUnder(idHit, (conf.getMinBalancePerGame()>=0?conf.getMinBalancePerGame():((Utilities.computeMaxBonusPerPlayer()+api.getReward(idHit))*conf.getPlayersPerGame())) * (1 + dbconn.countActiveGames()));
	if(Utilities.processAbandonedGames(dbconn, idPlayer)) {
		out.println("<div class=\"warning\">You were found in an abandoned game, so your earlier HIT assignment has been rejected.</div>");
	}
	if(Utilities.preventActiveRosterDuplicate(dbconn,idPlayer)) {
		out.println("<div class=\"warning\">You were found in an active game, so your earlier HIT assignment has been rejected.</div>");
	}
	int waitingStatus = Utilities.processWaitingPlayers(dbconn,idPlayer);
	if(waitingStatus == Constants.WAIT_DROP_LEGAL) {
		out.println("<div class=\"instruction\">You left the waiting room legally in a previous attempt, and will not be penalized.</div>");
	} else if(waitingStatus == Constants.WAIT_DROP_ILLEGAL) {
		out.println("<div class=\"warning\">You left the waiting room illegally in a previous attempt. The assignment in that attempt has been rejected, and the drop-out has been added to your record.</div>");
	}
	int standingStatus = Utilities.rejectIfBlockedOrOverplayed(dbconn, idPlayer, idAssignment);
	if(standingStatus == Constants.LIMITS_DROPS || standingStatus == Constants.LIMITS_GAMES) {
		out.println("<div class=\"warning\">");
		if(standingStatus == Constants.LIMITS_DROPS) {
			out.println("You dropped out of past games illegally too many times.");
		} else {
			out.println("You have played as many games as is permitted per player.");
		}
		out.println("Therefore, your HIT assignment has been rejected, and any further attempt to play will be treated likewise.\n</div>");
		return;
	}
	dbconn.newPlayer(request.getRemoteAddr(), idHit,idPlayer,idAssignment, contactable,request.getRemoteHost());
		}
		long countdownTimer = (Utilities.countdownWaitingRoom(dbconn, idPlayer, idAssignment)/1000)*1000;
		dbconn.updateLastPing(idPlayer, idAssignment);
		if(dbconn.getActiveRosterEntries(idPlayer).next()) {
	dbconn.clearIpAddress(idPlayer,idAssignment);
	getServletContext().getRequestDispatcher("/ready_room.jsp").forward(request,response);
		}
%>
		<div class="timerok"<%= (countdownTimer <= 0?" style=\"display:none\"":"") %> id="timer">Time Remaining: <span id="timerDisplay"><%= (countdownTimer/1000) %></span>s</div>
		
		<div class="instruction" id="waiting">Please wait to be matched with <%= conf.getPlayersPerGame()>2?"other players":"another player" %> to commence the game ...</div>
		<form method="post" name="masterForm" action="waiting_room.jsp" target="_self">
			<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="hitId" type="hidden" value="<%= idHit %>"/>
			<input name="countdownTimer" type="hidden" value="<%= countdownTimer %>"/>
		</form>
		<% if(countdownTimer > 0) { %>
		<div class="instruction">
		If you wait <%= (conf.getMinWaitingRoomTime()/1000) %> seconds without <%= conf.getPlayersPerGame()>2?"other players":"another player" %> showing up, we will compensate you with the basic task reward of USD <%= api.getReward(idHit) %>.
		</div>
		<% } else { %>
		<span class="instruction" id="instruction">Your minimum waiting period is over.
		You may continue waiting, but if you wish to leave now with just your task reward,
		you must click the following link, wait for the linked page to fully load, return to THIS page,
		and follow the instructions:</span>
		<br/><a class="continue" id="continue" onClick="javascript:submitChosen();setTimeout('readyToPay();',5000);" href="<%= (conf.getSubmitUrl()+URLEncoder.encode(idAssignment,Constants.URL_ENCODING)) %>" target="_blank">(CLICK HERE)</a>
		<br/><br/>
		<% } %>
		<div class="information"<%= (countdownTimer <= 0?"":"style=\"display:none\"") %>>
		</div>
		<script language="JavaScript">
		var s = setTimeout("document.masterForm.submit();",<%= conf.getWaitCycleTime() %>);
		var t = null;
		var ct = <%= countdownTimer %>;
		function submitChosen() {
			clearTimeout(s); if(t != null) clearTimeout(t);
			document.getElementById('continue').style.display='none';
			document.getElementById('waiting').style.display='none';
			document.getElementById('instruction').innerHTML='Please wait a moment ...';
		}
		function readyToPay() {
			document.getElementById('instruction').innerHTML='You may leave this task now. Thank you for waiting.';
		}
		function runTimer() {
			var ctd = document.getElementById("timerDisplay");
			if(ct > 0) {
				ct = ct - 1000;
				ctd.innerHTML = ct/1000;
			}
			if(ct > 0) {
				t = setTimeout("runTimer();",1000);
			}
		}
		if(ct > 0) {
			t = setTimeout("runTimer();",1000);
		}
		</script>
		<%
		Utilities.setupGames(dbconn);
	} else {
		System.out.println(idPlayer+"-"+idAssignment+"-"+idHit);
		Utilities.redirectError("Invalid parameters",request,response,getServletContext());
		return;
	}
%>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
