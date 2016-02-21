<%@page import="com.amazonaws.mturk.requester.HIT"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,java.sql.ResultSet,ae.ac.masdar.labs.scai.hagile.*,java.net.URLEncoder" %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Game Over</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<table class="phasetable"><tr><td class="indicateactivephase">GAME OVER</td></tr></table>
	<%
	if(!"post".equalsIgnoreCase(request.getMethod())) {
		Utilities.redirectError("Invalid method",request,response,getServletContext());
		return;
	}
	dbconn = DatabaseConnection.getInstance();
	PlatformAPI api = PlatformAPI.getInstance();
	Configuration conf = Configuration.getInstance();
	//Get Parameters
	String idPlayer = request.getParameter("playerId").trim();
	String idAssignment = request.getParameter("assignmentId").trim();
	String idGame = request.getParameter("gameId").trim();
	int round = Integer.parseInt(request.getParameter("round"));
	dbconn.deactivateGamePhase(idGame,round-1,Constants.PHASE_REVIEW);
	ResultSet are = dbconn.getActiveRosterEntries(idPlayer);
	ResultSet gr = dbconn.getGameRecord(idGame);
	ResultSet pr = dbconn.getPlayerRecord(idPlayer,idAssignment);
	if(!are.next() || !gr.next() || !pr.next() || !pr.isLast() || pr.getBoolean("processed")) {
		Utilities.redirectError("No matching set of valid records found",request,response,getServletContext());
		return;
	}
	int numPlayers = gr.getInt("num_players");
	double participationReward = api.getReward(pr.getString("id_hit"));
	if(!pr.getBoolean("active")) {
		if(!pr.getBoolean("processed")) {
	%>
			<div class="warning">Sorry, but since you have not performed requisite actions within the parameters and time frame as instructed by the game, you are considered to have quit the game.
			Your dropping out has been recorded in our system, and your earnings in the game thus far, if any, have been rendered forfeit.
			Please return the assignment to avoid further penalties.
			<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>
			<div id="timeoutFeedback">
				<br/>
				<form method="post" name="feedbackForm" action="feedback_processing.jsp" target="_self">
					<span class="instruction">
						Please let us know why you timed out:
						<br/><br/>
						<input name="q0" type="hidden" value="<%= Constants.TIMEOUT_QUESTION %>"/>
						<textarea name="a0" rows="3" cols="40" onKeyDown="javascript:return limitContents(this,1000);"></textarea>
					</span>
					<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
					<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
					<input name="gameId" type="hidden" value="<%= idGame %>"/>
					<br/><br/>
					<input class="submitbutton" name="proceed" type="submit" value="SUBMIT"/>
				</form>
				<script language="JavaScript">
				function limitContents(container,limit) {
					if(container.value.length > limit) {
						container.value = container.value.substring(0,limit);
						return false;
					} else {
						return true;
					}
				}
				</script>
			</div>
			<%
			Utilities.rejectDropBlock(api, dbconn,idPlayer,idAssignment,"Dropped out of game outside acceptable parameters");
			dbconn.deactivateRosterEntries(idPlayer);
			dbconn.deactivatePlayer(idPlayer);
			dbconn.processPlayer(idPlayer, idAssignment);
			int dropouts = dbconn.countDropoutRecords(idPlayer);
			if(conf.getMaxDropouts() > 0) {
				if(dropouts >= conf.getMaxDropouts()) {
					%>
					You have also quit too many games, and will therefore be barred from playing any more games.
					<%
				} else {
					%>
					You may try again, but <%= (conf.getMaxDropouts()-dropouts) %> more failed attempt<%= (conf.getMaxDropouts()-dropouts != 1?"s":"") %> (including those due to latency or connection breakage) will result in your account being banned from the game.
					<%
				}
			}
			%>
			</div>
			<%
			} else {
				%>
				<div class="warning">Sorry, but you have already played this game. Please do not try to refresh screens in the game.</div>
				<%
			}
			return;
	}
	String approved = null;
	if(request.getParameter("submitted") == null) {
		int numRounds = gr.getInt("num_rounds");
		if(round <= numRounds) {
			%>
				<div class="warning">The game has terminated due to the dropping out of <%= numPlayers>2?"one or more other players":"the other player" %>. We apologize for the inconvenience, and can assure you that you will be compensated for your earnings thus far. You may play again, if you wish.</div>
				<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>
			<%
		}
	} else {
		approved = api.approveAssignment(idAssignment,"Completed task as instructed all the way to the end");
		if(approved != null) {
			Utilities.logInfo("Failed to approve ["+idAssignment+"] for ["+idPlayer+"]");
		%>
			<div class="warning">HIT submission not registered with AMT ... please try again, allowing sufficient time for the linked page to load in its new tab/window.</div>
		<% } 
	}
	if(Constants.ACTIVATE_API && (request.getParameter("submitted") == null || approved != null)) {
		%>
		 
		 <br/><br/>
		<span class="instruction" id="instruction"><br/>In order to get paid, you must click the following link.
		A new tab or window will open, containing a <b>blank</b> screen, which you must <b>not</b> close.
		Just return to <b>this</b> tab/window, and follow the instructions:</span>
		<br/><a class="continue" id="continue" onClick="javascript:this.style.display='none';document.getElementById('instruction').innerHTML='Please wait about 30 seconds (do not return the HIT) ...';setTimeout('readyToPay();',30000);" href="<%= (conf.getSubmitUrl()+URLEncoder.encode(idAssignment,Constants.URL_ENCODING)) %>" target="_blank">(CLICK HERE)</a>
		<br/><br/>
		<form method="post" name="masterForm" action="termination_screen.jsp" target="_self">
			<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="gameId" type="hidden" value="<%= idGame %>"/>
			<input name="round" type="hidden" value="<%= round %>"/>
			<input name="submitted" type="hidden" value="submitted"/>
			<input class="submitbutton" name="proceed" type="submit" value="REVIEW GAME AND ACCEPT PAYMENT" style="display:none;"/>
		</form>
		<script language="JavaScript">
		function readyToPay() {
			document.getElementById('instruction').innerHTML='Now, please click the button below to accept your payment:';
			document.masterForm.proceed.style.display='block';
		}
		</script>
		<%
		return;
	}

	int played = dbconn.countRosterEntries(idPlayer);
		%>
		<div class="instruction">The following is a summary of your payment from this game.
		<% if(conf.getGamesPerPlayer() > 0 && played > 0) { %>You may play at most <%= conf.getGamesPerPlayer() %> game<%= conf.getGamesPerPlayer()==1?"":"s" %>, and you have already played <%= played %> game<%= played==1?"":"s" %>. Please note that attempts to play any more games than are allowed may be prevented by our system.<% } %>
		</div>
		<%
		ResultSet er = dbconn.getEarnings(idGame, idPlayer);
		List<Double> payouts = new ArrayList<Double>();
		double payout = 0;
		%>
		<table class="cleantable">
		<tr style="border-top:2px solid #000000;border-bottom:2px solid #000000">
			<th class="tableheader" colspan="2">Chips</th><th class="tableheader" colspan="2">Earning (USD)</th></tr>
		<tr><td class="tabledata">Participation</td><td class="tabledata">N/A</td><td class="tabledata"><%= participationReward %></td></tr>
		<%
	while(er.next()) {
		double roundPayout = er.getDouble("earning") * conf.getBonusPerEarnedToken();
		%>
		<tr>
		<td class="tabledata">Round <%= payouts.size()+1 %></td>
		<td class="tabledata"><%= Utilities.roundCash(er.getDouble("earning")) %></td><td class="tabledata"><%= Utilities.roundCash(roundPayout) %></td>
		</tr>
		<%
		payouts.add(roundPayout);
		payout += roundPayout;
	}
	if(approved == null) {
		Utilities.logInfo("Approved ["+idAssignment+"] for ["+idPlayer+"]");
		dbconn.logParticipationReward(idGame, idPlayer, participationReward);
	}
	String bonused = null;
	if(payout > 0) {
		bonused = api.grantBonus(idPlayer, payout,idAssignment, "Earnings based on performance in task");
		if(bonused == null) {
			Utilities.logInfo("Bonus ["+Utilities.roundCash(payout)+"] on ["+idAssignment+"] for ["+idPlayer+"]");
			for(int i = 0; i < payouts.size(); i++) {
				dbconn.logPayout(idGame, i+1, idPlayer, payouts.get(i));
			}
		}
	}
	dbconn.deactivateRosterEntries(idPlayer);
	dbconn.deactivatePlayer(idPlayer);
	dbconn.processPlayer(idPlayer, idAssignment);
	dbconn.deactivateGamePhases(idGame);
	dbconn.deactivateGame(idGame);
		%>
		<tr><td></td><td class="tabletotal">TOTAL (USD)</td><td class="tabletotal"><%= Utilities.roundCash(payout>0?payout:0) %> + <%= Utilities.roundCash(participationReward) %> = <%= Utilities.roundCash((payout>0?payout:0) + participationReward) %></td></tr>
		</table>
		<br/>
		<div class="instruction">
		Thank you for participating in this study,
		results from which will help us learn important lessons about human cooperative behavior.
			Your task assignment reward has been approved.
			<% if(payout > 0) { if(bonused == null) { %>Your bonus has also been approved.<% } else { %><span class="warning">However, your bonus approval has failed. Please contact the experiment administrator.</span><% } } %>
		<br/>
		<br/>
		We hope you will assist us towards better experiment design,
		by taking a moment to provide us with feedback about your experience
		with this run of the experiment.
		</div>
		<br/>
		<form method="post" name="masterForm" action="feedback_processing.jsp" target="_self">
		<table class="cleantable">
			<tr>
				<td class="tableinstruction">
					Your suggestions for improvements to the tutorial and quiz segment, if any:
					<br/>
					<input name="q0" type="hidden" value="INSTRUCTION"/>
					<textarea name="a0" rows="3" cols="80" onKeyDown="javascript:return limitContents(this,1000);"></textarea>
				</td>
			</tr>
			<tr>
				<td class="tableinstruction">
					Your suggestions for improvements to the interface design, if any:
					<br/>
					<input name="q1" type="hidden" value="INTERFACE"/>
					<textarea name="a1" rows="3" cols="80" onKeyDown="javascript:return limitContents(this,1000);"></textarea>
				</td>
			</tr>
			<tr>
				<td class="tableinstruction">
					Your understanding of what the experiment was trying to achieve:
					<br/>
					<input name="q2" type="hidden" value="IDEAS"/>
					<textarea name="a2" rows="3" cols="80" onKeyDown="javascript:return limitContents(this,1000);"></textarea>
				</td>
			</tr>
			<tr>
				<td class="tableinstruction">
					Other comments and/or suggestions:
					<br/>
					<input name="q3" type="hidden" value="OTHER"/>
					<textarea name="a3" rows="3" cols="80" onKeyDown="javascript:return limitContents(this,1000);"></textarea>
				</td>
			</tr>
		</table>
		<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
		<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
		<input name="gameId" type="hidden" value="<%= idGame %>"/>
		<br/>
		<input class="submitbutton" name="proceed" type="submit" value="SEND FEEDBACK"/>
		</form>
		<script language="JavaScript">
		function limitContents(container,limit) {
			if(container.value.length > limit) {
				container.value = container.value.substring(0,limit);
				return false;
			} else {
				return true;
			}
		}
		</script>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
