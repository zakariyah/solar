<%@page import="ae.ac.masdar.labs.scai.hagile.*"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*" %>
<% 	if(!Constants.ADMIN_CODE.equals(request.getParameter("adminCode"))) {
	Utilities.redirectError("Invalid request",request,response,getServletContext());
	return;
}
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Entry Point</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body>
	<%
	Thread.sleep((long)(new Random()).nextInt(500));
	String idPlayer = String.valueOf((new Date()).getTime()) + String.valueOf((new Random()).nextInt(1000000));
	Thread.sleep((long)(new Random()).nextInt(500));
	String idAssignment = String.valueOf((new Date()).getTime()) + String.valueOf((new Random()).nextInt(1000000));
	String idHit = String.valueOf((new Date()).getTime());
	%>
	<div class="information">Welcome to the SCAI Lab's HAGILE Experiment Interface.</div>
	<br/><br/>
		<form method="post" name="masterForm" action="walkthrough_quiz.jsp" target="_self">
			<input name="workerId" type="hidden" value="<%= idPlayer %>"/>
			<input name="assignmentId" type="hidden" value="<%= idAssignment %>"/>
			<input name="hitId" type="hidden" value="<%= idHit %>"/>
			<input align="middle" class="submitbutton" name="proceed" type="submit" value="START"/>
		</form>
</body>
</html>
