<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,java.sql.ResultSet,ae.ac.masdar.labs.scai.hagile.*" %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Starting Game</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<table class="phasetable"><tr><td class="indicateactivephase">READY ROOM</td></tr></table>
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
	long countdownTimer = -1;
	String idGame = null;
	
	ResultSet are = dbconn.getActiveRosterEntries(idPlayer);
	if(are.next()){ //there should be at least one
		countdownTimer = ((are.getTimestamp("start_time").getTime()-(new Date()).getTime())/1000)*1000;
		if(countdownTimer < 0) {
			countdownTimer = 0;
		}
		idGame = are.getString("id_game");
	} else {
		Utilities.redirectError("No record found",request,response,getServletContext());
		return;
	}
	if(!are.getString("id_assignment").equals(idAssignment)) {//assignment id should match
		Utilities.redirectError("Invalid assignment",request,response,getServletContext());
		return;
	}
	if(!are.isLast()){ //there should be no more than one
		Utilities.redirectError("Too many records",request,response,getServletContext());
		return;
	}
	Utilities.logInfo("["+idPlayer+"] on ["+idAssignment+"] joined game ["+idGame+"]");
	int round = 1;
	Utilities.newGamePhase(dbconn,idGame,round,Constants.PHASE_ACTION,new Date(are.getTimestamp("start_time").getTime()+conf.getSyncDelayTime()+Utilities.decayTime(conf.getActionPhaseTime(),round)));
	dbconn.activatePlayer(idPlayer,idAssignment);
	dbconn.updateLastPing(idPlayer,idAssignment);
	%>
	<div class="timerok" id="timer">Time Remaining: <span id="timerDisplay"><%= (countdownTimer/1000) %></span>s</div>
		<div class="instruction">Required number of players joined ... the game will start shortly.
		<br/><br/><b>We ask for your patience and your close attention for the next several minutes,
		<br/>as we can pay you only if every required action is taken within the time allotted.</b></div>
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
<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
