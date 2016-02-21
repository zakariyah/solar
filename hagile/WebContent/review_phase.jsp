<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,java.sql.ResultSet,ae.ac.masdar.labs.scai.hagile.*" %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Summary of Round</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<%
	if(!"post".equalsIgnoreCase(request.getMethod())) {
		Utilities.redirectError("Invalid method",request,response,getServletContext());
		return;
	}
	request.setAttribute(Constants.ATTR_NAV,Constants.PHASE_REVIEW);
	%>
	<jsp:include page="/nav_bar.jsp"/>
	<%
		dbconn = DatabaseConnection.getInstance();
		PlatformAPI api = PlatformAPI.getInstance();
		Configuration conf = Configuration.getInstance();
		//Get Parameters
		String idPlayer = request.getParameter("playerId").trim();
		String idAssignment = request.getParameter("assignmentId").trim();
		String idGame = request.getParameter("gameId").trim();
		int round = Integer.parseInt(request.getParameter("round"));
		dbconn.deactivateGamePhase(idGame,round,Constants.PHASE_ACTION);
		ResultSet ar = dbconn.getActiveRecords(idPlayer,round,idGame,Constants.PHASE_REVIEW);
		long countdownTimer = -1;
		if(ar.next()) { //there should be at least one
			countdownTimer = ((ar.getTimestamp("end_time").getTime()-(new Date()).getTime())/1000)*1000;
			if(countdownTimer < 0) {
				countdownTimer = 0;
			}
		} else {
			Utilities.redirectError("No record found",request,response,getServletContext());
			return;
		}
		if(!ar.getString("id_assignment").equals(idAssignment)){ //assignment id should match
			Utilities.redirectError("Invalid assignment",request,response,getServletContext());
			return;
		}
		if(!ar.isLast()){ //there should be no more than one
			Utilities.redirectError("Invalid assignment",request,response,getServletContext());
			return;
		}
		int numRounds = ar.getInt("num_rounds");
		Map<String,Boolean> actions = Utilities.validateRetrieveActions(dbconn, idGame, round);
		if(actions == null) {
			getServletContext().getRequestDispatcher(conf.getAbortPage()).forward(request,response);
		}
		Map<String,String> roster = Utilities.getCallsigns(dbconn, idGame); //put into session for efficiency?
		double ddPayoff = ar.getDouble("dd_payoff"); //
		double dcPayoff = ar.getDouble("dc_payoff"); //
		double cdPayoff = ar.getDouble("cd_payoff"); //
		double ccPayoff = ar.getDouble("cc_payoff"); //
		dbconn.updateLastPing(idPlayer,idAssignment);
		if(round < numRounds) {
		%>
		<div class="timerok" id="timer">Time Remaining: <span id="timerDisplay"><%= (countdownTimer/1000) %></span>s</div>
		<%
		}
		int numPlayers = ar.getInt("num_players");//N
		double earnings = 0;
		Iterator<String> iterPlayers = actions.keySet().iterator();
		%>
		<div class="information">Review<% if(numRounds > 1) { %> of this past round<% } %>:</div>
		<table class="cleantable">
			<tr><th class="tableheader">Player</th><th class="tableheader">Action</th><th class="tableheader">Payoff</th></tr>
			<tr><td class="playername">You</td><td class="tabledata"><%= actions.get(idPlayer)?"A":"B" %></td><td class="tabledata"><%= Utilities.getPayoff(idPlayer,actions,ddPayoff,dcPayoff,cdPayoff,ccPayoff) %></td></tr>
			<%
			earnings += Utilities.getPayoff(idPlayer,actions,ddPayoff,dcPayoff,cdPayoff,ccPayoff);
			iterPlayers = roster.keySet().iterator();
			while(iterPlayers.hasNext()) { 
				String idThisPlayer = iterPlayers.next();
				if(idThisPlayer.equals(idPlayer)) continue;%>
			<tr><td class="playername"><%= roster.get(idThisPlayer) %></td><td class="tabledata"><%= actions.get(idThisPlayer)?"A":"B" %></td><td class="tabledata"><%= Utilities.getPayoff(idThisPlayer,actions,ddPayoff,dcPayoff,cdPayoff,ccPayoff) %></td></tr>
			<% } %>
		</table>
		<%
		dbconn.logEarnings(idGame,round,idPlayer,earnings);
		round++;
		if(round <= numRounds) {
			//next round
			Utilities.newGamePhase(dbconn,idGame,round,Constants.PHASE_ACTION,new Date(ar.getTimestamp("end_time").getTime()+conf.getSyncDelayTime()+Utilities.decayTime(conf.getActionPhaseTime(),round)));
		%>
		<br/><br/>
		<div class="instruction">Please wait ... the next round will begin shortly.</div>
		<form method="post" name="masterForm" action="action_phase.jsp" target="_self">
			<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="gameId" type="hidden" value="<%= idGame %>"/>
			<input name="round" type="hidden" value="<%= round %>"/>
		</form>
		<script language="JavaScript">
		var s = setTimeout("document.masterForm.submit();",<%= countdownTimer + conf.getSyncDelayTime() %>);
		var t = null;
		var ct = <%= countdownTimer %>;
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
		} else {
		%>
		<br/><br/>
		<form method="post" name="masterForm" action="termination_screen.jsp" target="_self">
			<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="gameId" type="hidden" value="<%= idGame %>"/>
			<input name="round" type="hidden" value="<%= round %>"/>
			&nbsp;&nbsp;&nbsp;<input class="submitbutton" name="proceed" type="submit" value="PROCEED TO PAYMENT"/>
		</form>
		<%
		}
	%>
<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
