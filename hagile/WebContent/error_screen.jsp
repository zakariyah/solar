<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="ae.ac.masdar.labs.scai.hagile.*" %>
<% try { %>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Error!</title>
	<link href="hagile.css" rel="stylesheet" type="text/css"/>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body><div class="screen">
	<div class="warning">ERROR: <%= request.getAttribute(Constants.ATTR_ERROR) %></div>
<embed src="beep.wav" autostart="true" hidden="true" loop="false"><noembed><bgsound src="beep.wav" loop="1"></noembed></embed>
</div></body>
</html>
<% } catch (Exception ex) {
	Utilities.logError(ex);
	return;
} %>
