<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="ae.ac.masdar.labs.scai.hagile.*,java.util.*" %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Walk-through and Terms</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
<%
dbconn = DatabaseConnection.getInstance();
PlatformAPI api = PlatformAPI.getInstance();
Configuration conf = Configuration.getInstance();
//Get Parameters
String idHit = request.getParameter("hitId");
String idAssignment = request.getParameter("assignmentId");
String idPlayer = request.getParameter("workerId");
if(idPlayer == null) {
	idPlayer = request.getParameter("playerId");
}
if(idHit == null || api.getReward(idHit) < 0)  { //no HIT or HIT does not exist
	Utilities.redirectError("Invalid HIT ["+idHit+"]",request,response,getServletContext());
	return;
}
long minTimeMins = (long) Math.ceil(((conf.getReadyRoomTime()+conf.getMinGameRounds()*(conf.getActionPhaseTime()+conf.getReviewPhaseTime()))/60000));
long maxTimeMins = (long) Math.ceil((conf.getMinWaitingRoomTime()+conf.getReadyRoomTime()+conf.getMaxGameRounds()*(conf.getActionPhaseTime()+conf.getReviewPhaseTime()))/60000);

if(idAssignment == null || idAssignment.equals(Constants.ASSN_ID_NA)) {

	dbconn.logTaskBrowser(request.getRemoteAddr(), idHit);
	

	%>
	
	<div class="information">
	
	<p>Thank you for your interest in the experiment. We are a research team at Massachusetts Institute of Technology (MIT) and Masdar Institute,
	 and we seek your participation in furthering our understanding of human behavior in games.</p>
	
	<p>Your participation in this game will take between <%= minTimeMins %> and <%= maxTimeMins %> minutes.
	If you play the game all the way to the end, you will receive USD <%= api.getReward(idHit) %> as the reward for participating in the experiment.
	On top of that, you can earn a bonus of up to USD <%= Utilities.roundCash(Utilities.computeMaxBonusPerPlayer()) %>, based on your performance in the game.<br/><br/>
	These will be paid out at the end of the game, provided you follow all instructions, and do so within the time allotted.</p>
	
	<% if(conf.getGamesPerPlayer() > 0) { %><p>Please note that if our records indicate that you have
	already fully played this game<%= conf.getGamesPerPlayer() == 1?"":(" "+conf.getGamesPerPlayer()+" times") %>,
	you will have to return the task, as you will not be permitted to proceed
	(games from which you have been ejected due to a partner dropping out do not count towards this).</p><% } %>
	</div>
	
	<%
	return;
} 

if(idPlayer == null) {

	Utilities.redirectError("Invalid worker",request,response,getServletContext());
	return;

} else {
	if(conf.getGamesPerPlayer() > 0 && dbconn.countRosterEntries(idPlayer) >= conf.getGamesPerPlayer()) {
		out.println("<div class=\"warning\">You have played as many times as is allowed. Please return the task to avoid penalties.</div>");
		return;
	}
	
	if(conf.getMaxDropouts() > 0 && dbconn.countDropoutRecords(idPlayer) >= conf.getMaxDropouts()) {
		out.println("<div class=\"warning\">You have dropped out too many times, and may no longer play this game. Please return the task to avoid penalties.</div>");
		return;
	}
	
	if(!Constants.FULL_INTRO) {
		getServletContext().getRequestDispatcher("/waiting_room.jsp").forward(request,response);
		return;
	}
	
	int slide = 1;
	if(request.getParameter("slide") != null) {
		if(!"post".equalsIgnoreCase(request.getMethod())) {
			Utilities.redirectError("Invalid method",request,response,getServletContext());
			return;
		}
		slide = Integer.parseInt(request.getParameter("slide"));
	}

	//set up dummy game effects
	int numPlayers = conf.getPlayersPerGame();

	Map<String,String> roster = new TreeMap<String,String>();
	String idTestPlayer = "x1";
	String idDefectingPlayer = "x2";
	String idCooperatingPlayer = "x3";
	for(int i = 1; i <= numPlayers; i++) {
		roster.put("x"+i,"PLAYER"+i);
	}
	Map<String,Boolean> actions = new TreeMap<String,Boolean>();

	double ccPayoff = conf.getCCPayoff();
	double ddPayoff = conf.getDDPayoff();
	double dcPayoff = conf.getDCPayoff();
	double cdPayoff = conf.getCDPayoff();
	
	int numRounds = conf.getMaxGameRounds();
	Iterator<String> iterPlayers = roster.keySet().iterator();
	
	while(iterPlayers.hasNext()) {
		actions.put(iterPlayers.next(), new Random().nextBoolean());
	}
	Boolean myAction = actions.get(idTestPlayer);	
	%>
	<table class="phasetable"><tr><td class="indicateactivephase">
	<%
	int quizSlide = 7;
	if(slide == 1) {
		out.println("WELCOME");
	} else if(slide < quizSlide) {
		out.println("TUTORIAL (PAGE "+ (slide-1) + " OF " + (quizSlide-2) + ")");
	} else {
		out.println("QUIZ");
	}
	%>
	</td></tr></table>
	<%
	
	if(slide == 1) {

%>

<div class="information">

<p>Thank you for deciding to participate in the experiment.</p>

<p>We are a research team at Massachusetts Institute of Technology (MIT) and Masdar Institute, and we seek your participation in furthering our understanding of human behavior in games.</p>

<p>For your participation, you will be compensated with the task's standard reward of USD <%= api.getReward(idHit) %>, as well as a significant bonus that depends on your performance in the experiment.</p>

<p>Note that you will be paired up with other players, who, along with us, will be greatly inconvenienced if you do not follow the game's instructions for each action within the time allotted.
Please confirm that you are willing to participate in good faith, using the following checkbox. If you are not willing to do so, please return the assignment.</p>
<div class="instruction"><input type="checkbox" id="committed"/>&nbsp;I understand that this game requires my undivided attention for up to <%= maxTimeMins %> minutes, and I am willing to commit said time and attention until the game comes to an end.</div>
<div class="warning" id="warning" style="display:none">If you are not willing to confirm the above statement, please return the assignment.</div>
<p>Please click the button below to start the tutorial.</p>
<% Utilities.logInfo("["+idPlayer+"] accepted ["+idAssignment+"]"); %>
<table class="cleantable"><tr><td align="left">
</td><td align="right">
<form method="post" target="_self" action="walkthrough_quiz.jsp" onSubmit="javascript:if(!document.getElementById('committed').checked) { document.getElementById('warning').style.display='block'; return false;}">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide+1) %>"/>
<input type="submit" class="submitbutton" value="START TUTORIAL"/>
</form>
</td></tr></table>
</div>

<% } else if(slide == 2) { %>

<div class="information">
<p><b>Please read the instructions carefully, as you will be quizzed about them, and they may change from game to game.</b></p>

<p>As a participant in this experiment, you will play
a simple game with <%= (numPlayers-1) %>
other participant<% if(numPlayers != 2) {%>s<% } %>.
Your participation will take between <%= minTimeMins %> and <%= maxTimeMins %> minutes.
<% if(conf.getGamesPerPlayer() > 0) { %>You may play the game <%= conf.getGamesPerPlayer() %> time<% if(conf.getGamesPerPlayer() != 1) {%>s<% } %> at
most<% if(conf.getMaxGameRounds() > 1) { %>, each game consisting of a number of rounds.<% } %>
You are matched with the same <%= numPlayers > 2?"set of fellow players":"player" %> across all rounds within a given game<% } else { %>.<% } %>
</p>

<p>After going through the instructions and a walk-through of the game, and then answering a short quiz on these,
you will be placed in a waiting room. The game will start as soon as <%= numPlayers > 2?"the required number of players have":" a partner has" %> joined the game, at which point a beep will alert you.
If this does not happen within <%= (conf.getMinWaitingRoomTime()/1000) %> seconds (there will be a timer counting down),
you have the option of leaving with just the task's standard reward. You may continue waiting if you wish,
but once a game has started, leaving the game before the final payment screen
will result in you getting paid neither the task reward nor the accumulated bonus.</p>

<!-- <p>Each phase in the game is timed,
and if a phase requires you to perform a specific action,
you must do so within the allotted time in order to avoid being ejected from the game.
<% if(conf.getMaxGameRounds() > 1) { %>The time allotted for each phase in the first round of the game will be longer than those in subsequent rounds,
in order to allow you time to get used to the interface.<% } %></p> -->

<table class="cleantable"><tr><td align="left">
</td><td align="right">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide+1) %>"/>
<input type="submit" class="submitbutton" value="NEXT PAGE &raquo;"/>
</form>
</td></tr></table>

</div>

<% } else if(slide == 3) { %>

<div class="information">

<p><% if(conf.getMaxGameRounds() > 0) {%>In each round of the game, y<% } else { %>Y<% } %>ou and your fellow participant<%= numPlayers > 2?"s":"" %> will
be individually offered a choice between two actions. After selecting your action, you must press the LOCK ACTION button before the timer at the top of the page runs out.</p>

<p><br/>This is the <u>Action Phase</u>.</p>
				Example:<br/><br/>
				<div class="screenbox">
					<%
					request.setAttribute(Constants.ATTR_NAV,Constants.PHASE_ACTION);
					%>
					<jsp:include page="/nav_bar.jsp"/>
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
			<p><span class="instruction">&nbsp;&nbsp;&nbsp;Your Choice of Action:</span> <select name="action" disabled="disabled">
				<option value="">?</option>
				<option value="true"<%= myAction?" selected=\"selected\"":"" %>>A</option>
				<option value="false"<%= myAction?"":" selected=\"selected\"" %>>B</option>
			</select>&nbsp;<input align="middle" class="submitbutton" name="proceed" type="submit" value="LOCK ACTION" disabled="disabled"/>
			</p>
					<br/>
					<br/>
				</div>
					<p>
					</p>
<table class="cleantable"><tr><td align="left">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide-1) %>"/>
<input type="submit" class="submitbutton" value="&laquo; PREV PAGE"/>
</form>
</td><td align="right">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide+1) %>"/>
<input type="submit" class="submitbutton" value="NEXT PAGE &raquo;"/>
</form>
</td></tr></table>

</div>

<%
	} else if(slide == 4) {
		double earnings = 0;
%>

<div class="information">

<p>In the next screen, each participant is presented with a review<% if(numRounds > 1) { %> of the round<% } %>. You can see your and
<%=numPlayers>2?"":"the" %> other participant<%=numPlayers>2?"s'":"'s" %> actions and payoffs<% if(numRounds > 1) { %> for the round, which will add up at the end of all rounds to each participant's total payment<% } %>.
<br/><br/>This is the <u>Review Phase</u></p>
<br/>
					Example:<br/><br/>
					<div class="screenbox">
					<%
					request.setAttribute(Constants.ATTR_NAV,Constants.PHASE_REVIEW);
					%>
					<jsp:include page="/nav_bar.jsp"/>
					<table class="cleantable">
						<tr><th class="tableheader">Player</th><th class="tableheader">Action</th><th class="tableheader">Payoff</th></tr>
						<tr><td class="playername">You</td><td class="tabledata"><%= actions.get(idTestPlayer)?"A":"B" %></td><td class="tabledata"><%= Utilities.getPayoff(idTestPlayer,actions,ddPayoff,dcPayoff,cdPayoff,ccPayoff) %></td></tr>
						<%
						earnings += Utilities.getPayoff(idTestPlayer,actions,ddPayoff,dcPayoff,cdPayoff,ccPayoff);
						iterPlayers = roster.keySet().iterator();
						while(iterPlayers.hasNext()) { 
							String idThisPlayer = iterPlayers.next();
							if(idThisPlayer.equals(idTestPlayer)) continue;%>
						<tr><td class="playername"><%= roster.get(idThisPlayer) %></td><td class="tabledata"><%= actions.get(idThisPlayer)?"A":"B" %></td><td class="tabledata"><%= Utilities.getPayoff(idThisPlayer,actions,ddPayoff,dcPayoff,cdPayoff,ccPayoff) %></td></tr>
						<% } %>
					</table>
					<br/>
					<% if(numRounds > 1) { %><div class="instruction">Please wait ... the next round will begin shortly.</div><% } %>
						
					</div>
<br/>
In this case, your total income<% if(numRounds > 1) { %> <u>for this round only</u><% } %> is <%= Utilities.roundCash(earnings) %> chips, based on the actions that you and other player<%= numPlayers > 2?"s":"" %> took.
<p><% if(numRounds > 0) {%>If this is the last round, y<% } else {%>Y<% } %>ou have to then click a button to review the game and follow instructions to take you to the final payment screen (you will not be paid until you do this).
</p>

<table class="cleantable"><tr><td align="left">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide-1) %>"/>
<input type="submit" class="submitbutton" value="&laquo; PREV PAGE"/>
</form>
</td><td align="right">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide+1) %>"/>
<input type="submit" class="submitbutton" value="NEXT PAGE &raquo;"/>
</form>
</td></tr></table>

</div>

<% } else if(slide == 5) { %>

<div class="information">

<p>Note the circumstances in which participants will not be paid:</p>
<ul>
<li>Once in the waiting room, they leave the waiting room before the waiting room timer runs out.</li>
<li>In a game, they do not lock actions before the respective timers run out.</li>
<li>Once in a game, they try to return an assignment or stop/close a game at any time before the final payment screen.</li>
</ul> 

<table class="cleantable"><tr><td align="left">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide-1) %>"/>
<input type="submit" class="submitbutton" value="&laquo; PREV PAGE"/>
</form>
</td><td align="right">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide+1) %>"/>
<input type="submit" class="submitbutton" value="NEXT PAGE &raquo;"/>
</form>
</td></tr></table>

</div>

<% } else if(slide == 6) { %>

<div class="information">

<p>Payment will be the total earnings in the game<% if(numRounds > 0) {%> across all rounds<% } %>.
In the unlikely event that the  performance-based component of a participant's earning in the game adds up negative in the grand total, it will be ignored (no negative bonus earning is possible).</p>
<p>Participants are anonymous to one another.</p>
<p><b>Please note that you must have JavaScript enabled at all times while you are playing this game, and that you must disable any browser security features that prevent or otherwise inhibit JavaScript within frames. Please also do not try to refresh or stop pages, or to use the browser's "Back" button. If you are asked to install a plugin for sound, please do so.</b></p>
<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>

<p>The next screen is a quiz that will help refine your understanding of the game.</p>

<table class="cleantable"><tr><td align="left">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide-1) %>"/>
<input type="submit" class="submitbutton" value="&laquo; PREV PAGE"/>
</form>
</td><td align="right">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide+1) %>"/>
<input type="submit" class="submitbutton" value="TAKE THE QUIZ"/>
</form>
</td></tr></table>

</div>
<% } else if (slide == quizSlide) {
		double[] payoffs = {1,3,0,2};
		%>
		
		<div class="instruction">We hope the tutorial was useful. You may proceed to the waiting room for the game, once you submit correct answers to all the following questions regarding the payoff structure below:</div>
				<div class="screenbox">
		<div class="instruction">Each of you can choose between action A and B. These are the payoffs:<br/><br/>
		<table class="cleantable">
		<tr><td class="tabledata"></td><td class="tabledata"></td><th class="tableheader" colspan="2">Your Action</th></tr>
		<tr><td class="tabledata"></td><td class="tabledata"></td><th class="tableheader">A</th><th class="tableheader">B</th></tr>
		<tr><th class="tableheader" rowspan="2">Their<br/>Action</th><th class="tableheader">A</th><td class="tabledata">You Get <%= payoffs[3] %><br/>They Get <%= payoffs[3] %></td><td class="tabledata">You Get <%= payoffs[1] %><br/>They Get <%= payoffs[2] %></td></tr>
		<tr><th class="tableheader">B</th><td class="tabledata">You Get <%= payoffs[2] %><br/>They Get <%= payoffs[1] %></td><td class="tabledata">You Get <%= payoffs[0] %><br/>They Get <%= payoffs[0] %></td></tr>
		</table>
		</div>
		<br/>
 				</div>
					<p>
					</p>
			<table class="cleantable">
				<% for(int i = 0; i < 2; i++) { %>
					<% for(int j = 0; j < 2; j++) {
						int nq = i * 2 + j *1;
						int cq = nq+1;
						boolean bi = (i == 1);
						boolean bj = (j == 1);
					%>
				<tr>
					<td class="tableinstruction">
					How much do you get if you choose action <%= bi?"A":"B" %> <%= bi==bj?"and":"but" %> the other player <%= bi==bj?"also":"" %> chooses action <%= bj?"A":"B" %>?
					<span id="q<%= cq %>i"></span>
					<br/>
					<input type="radio"<%= nq==2?(" id=\"q"+cq+"a\""):"" %> name="q<%= cq %>" value="<%= nq==2?"0":"1" %>"><%= payoffs[2] %><br/>
					<input type="radio"<%= nq==0?(" id=\"q"+cq+"a\""):"" %> name="q<%= cq %>" value="<%= nq==0?"0":"1" %>"><%= payoffs[0] %><br/>
					<input type="radio"<%= nq==3?(" id=\"q"+cq+"a\""):"" %> name="q<%= cq %>" value="<%= nq==3?"0":"1" %>"><%= payoffs[3] %><br/>
					<input type="radio"<%= nq==1?(" id=\"q"+cq+"a\""):"" %> name="q<%= cq %>" value="<%= nq==1?"0":"1" %>"><%= payoffs[1] %>
					</td>
				</tr>
					<% } %>
				<% } %>
			</table>
			<br/><br/>
			<span class="warning" id="warningMessage" style="display:none;"></span>
			<br/><br/>
<div class="instruction"><input type="checkbox" id="contactable" checked="checked"/>&nbsp;I would like to be notified of future experiments.</div>
<table class="cleantable"><tr><td align="left">
<form method="post" target="_self" action="walkthrough_quiz.jsp">
<input type="hidden" name="hitId" value="<%= idHit %>"/>
<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
<input type="hidden" name="slide" value="<%= (slide-1) %>"/>
<input type="submit" class="submitbutton" value="&laquo; BACK TO TUTORIAL"/>
</form>
</td><td align="right">
			<form name="masterForm" method="post" target="_self" action="waiting_room.jsp" onSubmit="javascript:return verifyAnswers();">
			<input type="hidden" name="hitId" value="<%= idHit %>"/>
			<input type="hidden" name="assignmentId" value="<%= idAssignment %>"/>
			<input type="hidden" name="playerId" value="<%= idPlayer %>"/>
			<input type="hidden" name="contactable" value=""/>
			<input type="submit" name="proceed" class="submitbutton" value="SUBMIT ANSWERS"/>
			</form>
</td></tr></table>

		<script language="JavaScript">
		function verifyAnswers() {
			if(document.getElementById("contactable").checked) {
				document.masterForm.contactable.value="yes";
			} else {
				document.masterForm.contactable.value="no";
			}
			var warningMessage = document.getElementById("warningMessage");
			<% if(!Constants.CHECK_QUIZ) { %>return true;<% } %>
			var tally = 0;
			var mq = 10;
			var q = 0;
			for(var i=1;i<=mq;i++) {
				if(document.getElementById("q"+i+"a")) {
					if(document.getElementById("q"+i+"a").checked == true) {
						tally = tally+1;
						document.getElementById("q"+i+"i").innerHTML = "(CORRECT)";
						document.getElementById("q"+i+"i").className = "correctanswer";
					} else {
						document.getElementById("q"+i+"i").innerHTML = "(WRONG)";
						document.getElementById("q"+i+"i").className = "wronganswer";
					}
					q += 1;
				}
			}
			if(tally == q) {
				//document.masterForm.proceed.disabled = false;
				warningMessage.style.display="none";
				return true;
			} else {
				//document.masterForm.proceed.disabled = true;
				warningMessage.innerHTML = "You have answered "+tally+" of "+q+" questions correctly.";
				warningMessage.style.display="inline";
				return false;
			}
		}
		</script>

	<%
}
}%>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
