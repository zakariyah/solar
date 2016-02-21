<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,java.sql.ResultSet,ae.ac.masdar.labs.scai.hagile.*" %>
<% 	if(!Constants.ADMIN_CODE.equals(request.getParameter("adminCode"))) {
	Utilities.redirectError("Invalid request",request,response,getServletContext());
	return;
}
 %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Broadcast Message to Turkers</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
<%
//String whereClause = request.getParameter("whereClause");
String subjectLine = request.getParameter("subjectLine");
String messageText = request.getParameter("messageText");
int fromHour = Integer.parseInt(request.getParameter("fromHour")==null?"0":request.getParameter("fromHour"));
int toHour = Integer.parseInt(request.getParameter("toHour")==null?"0":request.getParameter("toHour"));
String proceed = request.getParameter("proceed");

if(subjectLine != null && messageText != null && proceed != null) {
	if(!"post".equalsIgnoreCase(request.getMethod())) {
		Utilities.redirectError("Invalid method",request,response,getServletContext());
		return;
	}
	if(subjectLine.trim().length() == 0 || messageText.trim().length() == 0) {
		%><div class="warning">You must enter a subject and a message</div><%
	} else if(fromHour > 23 || toHour > 23 || fromHour < 0 || toHour < 0) {
		%><div class="warning">You must enter a valid time span</div><%
	} else {
		String clauseAppend = "";
		if(fromHour != toHour) {
			if(fromHour > 0) {
				clauseAppend += " and hour(log_time) >= "+fromHour;
			}
			if(toHour > 0) {
				clauseAppend += " and hour(log_time) <= "+toHour;
			}
		}
		if(clauseAppend.length() > 0) {
			clauseAppend = " WHERE 1=1" + clauseAppend;
		}
		dbconn = DatabaseConnection.getInstance();
		ResultSet rsPlayers = dbconn.getPanel(clauseAppend);
		Set<String> idPlayers = new HashSet<String>();
		while(rsPlayers.next()) {
			Boolean contactable = rsPlayers.getBoolean("contactable");
			String idPlayer = rsPlayers.getString("id_player");
			if(contactable != null) {
				if(contactable && idPlayers.size() < 100) {
					idPlayers.add(idPlayer);
				} else {
					idPlayers.remove(idPlayer);
				}
			}
		}
		if(idPlayers.size() == 0) {
			%><div class="warning">No matching ids found</div><%
		} else {
			String[] audience = new String[idPlayers.size()];
			Iterator<String> iterPlayers = idPlayers.iterator();
			int iPlayer = 0;
			while(iterPlayers.hasNext()) {
				audience[iPlayer++] = iterPlayers.next();
			}
			String sendStatus = PlatformAPI.getInstance().notifyWorkers(subjectLine,messageText,audience);
			if(sendStatus == null) {
				%><div class="information">Message sent to <%= idPlayers.size() %> turkers</div><%
			} else {
				%><div class="warning"><%= Constants.HIDE_ERROR?"Broadcast failed":sendStatus %></div><%
			}
		}
	}
}
%>
<br/><br/>
			<form method="post" name="masterForm" action="turker_broadcast.jsp" target="_self">
				<input name="adminCode" type="hidden" value="<%= request.getParameter("adminCode") %>"/>
				<span class="instruction">MESSAGE PLAYERS WHO ...</span>
				<br/><br/><span class="instruction">PLAYED BETWEEN</span>
				<input name="fromHour" class="textbox" type="text" value="0" size="2" maxLength="2"/>
				<span class="instruction">AND</span>
				<input name="toHour" class="textbox" type="text" value="0" size="2" maxLength="2"/>
				<span class="instruction">HRS GMT</span>
				<br/><br/><span class="instruction">SUBJECT:</span><input name="subjectLine" class="textbox" type="text" value="" size="50" maxLength="100"/>
				<br/><br/><span class="instruction">MESSAGE:</span>
				<br/>&nbsp;&nbsp;&nbsp;<textarea name="messageText" rows="20" cols="80" onKeyDown="javascript:return limitContents(this,1000);"></textarea>
				<br/><br/>
				&nbsp;&nbsp;&nbsp;<input class="submitbutton" name="proceed" type="submit" value="SUBMIT"/>
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
