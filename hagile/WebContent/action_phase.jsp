<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,java.sql.ResultSet,ae.ac.masdar.labs.scai.hagile.*" %>
<% try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Choose Your Action</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<%
	if(!"post".equalsIgnoreCase(request.getMethod())) {
		Utilities.redirectError("Invalid method",request,response,getServletContext());
		return;
	}
	request.setAttribute(Constants.ATTR_NAV,Constants.PHASE_ACTION);
	%>
	<jsp:include page="/nav_bar.jsp"/>
	<%
	DatabaseConnection dbconn = DatabaseConnection.getInstance();
	PlatformAPI api = PlatformAPI.getInstance();
	Configuration conf = Configuration.getInstance();
	//Get Parameters
	String idPlayer = request.getParameter("playerId").trim();
	String idAssignment = request.getParameter("assignmentId").trim();
	String idGame = request.getParameter("gameId").trim();
	int round = Integer.parseInt(request.getParameter("round"));
	dbconn.deactivateGamePhase(idGame,round-1,Constants.PHASE_REVIEW);
	ResultSet ar = dbconn.getActiveRecords(idPlayer,round,idGame,Constants.PHASE_ACTION);
	long countdownTimer = -1;
	if(ar.next()){ //there should be at least one
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
		Utilities.redirectError("Too many records",request,response,getServletContext());
		return;
	}
	int numRounds = ar.getInt("num_rounds");
	if(!Utilities.validateRoster(dbconn, idGame)) {
		getServletContext().getRequestDispatcher(conf.getAbortPage()).forward(request,response);
	}
	%>
	<div class="timerok" id="timer">Time Remaining: <span id="timerDisplay"><%= (countdownTimer/1000) %></span>s</div>
	<%
	int numPlayers = ar.getInt("num_players");//N
	double ddPayoff = ar.getDouble("dd_payoff"); //
	double dcPayoff = ar.getDouble("dc_payoff"); //
	double cdPayoff = ar.getDouble("cd_payoff"); //
	double ccPayoff = ar.getDouble("cc_payoff"); //
	if(request.getParameter("countdownTimer") == null) {
	%>
		<% if(numRounds > 1) { %><div class="warning">STARTING NEW ROUND</div><br/><% } %>
		<div class="instruction">Each of you can choose between action A and B. These are the payoffs:<br/><br/>
		<table class="cleantable">
		<tr><td class="tabledata"></td><td class="tabledata"></td><th class="tableheader" colspan="2">Your Action</th></tr>
		<tr><td class="tabledata"></td><td class="tabledata"></td><th class="tableheader">A</th><th class="tableheader">B</th></tr>
		<tr><th class="tableheader" rowspan="2">Their<br/>Action</th><th class="tableheader">A</th><td class="tabledata">You Get <%= ccPayoff %><br/>They Get <%= ccPayoff %></td><td class="tabledata">You Get <%= dcPayoff %><br/>They Get <%= cdPayoff %></td></tr>
		<tr><th class="tableheader">B</th><td class="tabledata">You Get <%= cdPayoff %><br/>They Get <%= dcPayoff %></td><td class="tabledata">You Get <%= ddPayoff %><br/>They Get <%= ddPayoff %></td></tr>
		</table>
		</div>
		<br/>
		<form method="post" name="masterForm" action="action_phase.jsp" target="_self" onSubmit="javascript:return verifyAction();">
			<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="gameId" type="hidden" value="<%= idGame %>"/>
			<input name="round" type="hidden" value="<%= round %>"/>
			<input name="countdownTimer" type="hidden" value="<%= countdownTimer %>"/>
			<p><span class="instruction">&nbsp;&nbsp;&nbsp;Your Choice of Action:</span> <select name="action">
				<option value="">?</option>
				<option value="true">A</option>
				<option value="false">B</option>
			</select>&nbsp;<input align="middle" class="submitbutton" name="proceed" type="submit" value="LOCK ACTION"/>
			</p>
			<span class="warning" id="warningMessage" style="display:none;">You must choose an action.</span><br/><br/>
			<br/>
			<br/>
		</form>
		<div id="timeoutFeedback" style="display:none;">
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
		<script language="JavaScript">
		document.masterForm.action.focus();
		var s = setTimeout("document.masterForm.proceed.className = 'deadbutton';",<%= countdownTimer %>);
		var t = null;
		var ct = <%= countdownTimer %>;
		function runTimer() {
			var ctd = document.getElementById("timerDisplay");
			if(ct > 0) {
				ct = ct - 1000;
				ctd.innerHTML = ct/1000;
			}
			if(ct < <%= Constants.CRITICAL_TIME %>) {
				document.getElementById("timer").className = "timercritical";
			}
			if(ct > 0) {
				t = setTimeout("runTimer();",1000);
			} else {
				document.getElementById("timeoutFeedback").style.display="block";
			}
		}
		if(ct > 0) {
			t = setTimeout("runTimer();",1000);
		}
		function verifyAction() {
			var inputObject = document.masterForm.action;
			var warningMessage = document.getElementById("warningMessage");
			if(ct <= 0) {
				warningMessage.style.display="inline";
				warningMessage.innerHTML="Sorry, you are out of time. Please return the task to avoid penalties.";
				document.getElementById("timeoutFeedback").style.display="block";
				return false;
			}
			var action = null;
			try {
				action = inputObject.options[inputObject.selectedIndex].value;
			} catch (err) {
			}
			if(action != null) { 
				//document.masterForm.proceed.disabled=false;
				warningMessage.style.display="none";
				return true;
			} else {
				//document.masterForm.proceed.disabled=true;
				warningMessage.style.display="inline";
				return false;
			}
		}
		</script>
	<%
	} else {
		Utilities.newGamePhase(dbconn,idGame,round,Constants.PHASE_REVIEW,new Date(ar.getTimestamp("end_time").getTime()+conf.getSyncDelayTime()+Utilities.decayTime(conf.getReviewPhaseTime(),round)));
		dbconn.updateLastPing(idPlayer,idAssignment);
		Boolean action = null;
		if(request.getParameter("action") == null || request.getParameter("action").length()==0) {
			Utilities.redirectError("Invalid action ["+action+"]",request,response,getServletContext());
			return;
		} else {
			action = Boolean.parseBoolean(request.getParameter("action")); //action
		}
		dbconn.logAction(idPlayer,idGame,round,action);
	%>
		<div class="information">You chose action <%= action?"A":"B" %>.</div>
		<form method="post" name="masterForm" action="review_phase.jsp" target="_self">
			<input name="playerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="gameId" type="hidden" value="<%= idGame %>"/>
			<input name="round" type="hidden" value="<%= round %>"/>
		</form>
		<br/>
		<div class="instruction">Please wait ... the next phase will begin shortly.</div>
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
	}
	%>
<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} %>
