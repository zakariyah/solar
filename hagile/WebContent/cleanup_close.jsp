<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*,ae.ac.masdar.labs.scai.hagile.*" %>
<% 	if(!Constants.ADMIN_CODE.equals(request.getParameter("adminCode"))) {
	Utilities.redirectError("Invalid request",request,response,getServletContext());
	return;
}
 %>
<% DatabaseConnection dbconn = null;
try { %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Cleanup Stragglers and Expire HIT</title>
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache"> <META HTTP-EQUIV="Expires" CONTENT="-1">
</head>
<body>
<%
	dbconn = DatabaseConnection.getInstance();
	PlatformAPI api = PlatformAPI.getInstance();
	Configuration conf = Configuration.getInstance();
	//Get Parameters
	String idHit = request.getParameter("hitId");
	boolean mop = ("true".equals(request.getParameter("mop"))); //cleanup expired games and players
	boolean pop = ("true".equals(request.getParameter("pop"))); //close the hit
	String idPlayer= "";
	//Expire the task if we don't have more than the estimated maximum per-game payout across all active games
	if(pop) {
		if(idHit == null || api.getReward(idHit) < 0) {
			Utilities.redirectError("Invalid HIT",request,response,getServletContext());
			return;
		}
		api.expireNow(idHit);
		Utilities.logInfo("Closed HIT ["+idHit+"]");
	}
	if(mop) {
		Utilities.processAbandonedGames(dbconn,idPlayer);
		Utilities.logInfo("Processed abandoned games");
		Utilities.processWaitingPlayers(dbconn,idPlayer);
		Utilities.logInfo("Processed expired players");
	}
%>
</body>
</html>
<% } catch (Exception ex) {
	Utilities.redirectError(ex,request,response,getServletContext());
	return;
} finally {
	if(dbconn != null) dbconn.closeConnection();
} %>
