<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,java.sql.ResultSet,ae.ac.masdar.labs.scai.hagile.*" %>
<% DatabaseConnection dbconn = null;
try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Thank You for Your Feedback</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<%
		if(!"post".equalsIgnoreCase(request.getMethod())) {
			Utilities.redirectError("Invalid method",request,response,getServletContext());
			return;
		}
		dbconn = DatabaseConnection.getInstance();
		Configuration conf = Configuration.getInstance();
		//Get Parameters
		String idPlayer = request.getParameter("playerId").trim();
		String idAssignment = request.getParameter("assignmentId").trim();
		String idGame = request.getParameter("gameId").trim();
		ResultSet gr = dbconn.getGameRecord(idGame);
		if(!gr.next()) {
			Utilities.redirectError("No matching valid record found",request,response,getServletContext());
			return;
		}
		int i = 0;
		while(true && i < Integer.MAX_VALUE) {
			String question = request.getParameter("q" + i);
			String answer = request.getParameter("a" + i);
			if(question == null || question.trim().length() == 0) {
				break;
			}
			if(answer.trim().length() > 0) {
				dbconn.logFeedback(idPlayer, idGame, question, answer);
			}
			i++;
		}
		
	%>
	<span class="instruction">
	<br/>Thank you for your feedback.
	<% if(Constants.TIMEOUT_QUESTION.equals(request.getParameter("q0"))) { %>
	 <br/>Please return the HIT to avoid any penalties for timing out.
	<% } %></span>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
