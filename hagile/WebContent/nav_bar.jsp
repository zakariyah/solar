<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="ae.ac.masdar.labs.scai.hagile.*" %>
<%
	String phase = String.valueOf(request.getAttribute(Constants.ATTR_NAV));
%>
<table class="phasetable"><tr>
	<td class="indicate<%= phase.equals(Constants.PHASE_ACTION)?"":"in" %>activephase">ACTION</td>
	<td class="phasearrow">&rarr;</td>
	<td class="indicate<%= phase.equals(Constants.PHASE_REVIEW)?"":"in" %>activephase">REVIEW</td>
</tr></table>