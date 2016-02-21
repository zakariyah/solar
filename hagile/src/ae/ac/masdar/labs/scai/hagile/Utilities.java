package ae.ac.masdar.labs.scai.hagile;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.sql.ResultSet;
import org.apache.log4j.Logger;

import java.sql.SQLException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;

public class Utilities {
	
	public static Logger logger = Logger.getLogger("beisics");
	
	public static void logInfo(String msg) {
		logger.info(msg);
		//System.out.println(msg);
	}
	
	public static void logError(String msg) {
		logger.error(msg);
		//System.err.println(msg);
	}
	
	public static void logError(Exception ex) {
		if(ex != null) {
			logger.error(ex.getMessage(), ex);
			//ex.printStackTrace();
		}
	}
	
	public static void redirectError(String msg, HttpServletRequest request, HttpServletResponse response, ServletContext context) throws Exception {
		logger.error(msg);
		//System.err.println(msg);
		request.setAttribute(Constants.ATTR_ERROR, (Constants.HIDE_ERROR?"Please contact experiment administrator.":msg));
		context.getRequestDispatcher(Configuration.getInstance().getErrorPage()).forward(request, response);
	}
	
	public static void redirectError(Exception ex, HttpServletRequest request, HttpServletResponse response, ServletContext context) throws Exception {
		if(ex != null) {
			logger.error(ex.getMessage(), ex);
			//ex.printStackTrace();
		}
		Writer result = new StringWriter();
	    PrintWriter printWriter = new PrintWriter(result);
	    ex.printStackTrace(printWriter);
		String msg = ex.getMessage() + "<pre>" + result + "</pre>";
		request.setAttribute(Constants.ATTR_ERROR, (Constants.HIDE_ERROR?"Please contact experiment administrator.":msg));
		context.getRequestDispatcher(Configuration.getInstance().getErrorPage()).forward(request, response);
	}
	
	public static long countdownWaitingRoom(DatabaseConnection dbconn, String idPlayer, String idAssignment) throws Exception {
		Configuration conf = Configuration.getInstance();
		ResultSet pr = dbconn.getPlayerRecord(idPlayer, idAssignment);
		pr.next();
		long startTime = pr.getTimestamp("log_time").getTime();
		return conf.getMinWaitingRoomTime() - (new Date()).getTime() + startTime;
	}
	
	public static boolean processAbandonedGames(DatabaseConnection dbconn, String idPlayer) throws Exception {
		boolean abandoned = false;
		Configuration conf = Configuration.getInstance();
		ResultSet aegp = dbconn.getActiveExpiredGamePhases(2 * conf.getSyncDelayTime());
		PlatformAPI api = null;
		while(aegp.next()) {
			if(api == null) {
				api = PlatformAPI.getInstance();
			}
			String idGame = aegp.getString("id_game");
			dbconn.deactivateGamePhases(idGame);
			dbconn.deactivateGame(idGame);
			ResultSet aegpr = dbconn.getRoster(idGame);
			while(aegpr.next()) {
				closeErrantPlayerCase(dbconn, aegpr.getString("id_player"), aegpr.getString("id_assignment"), "Worker has not responded to task instructions on time.");
				if(aegpr.getString("id_player").equals(idPlayer)) {
					abandoned = true;
				}
			}
		}
		return abandoned;
	}
	
	public static synchronized boolean preventActiveRosterDuplicate(DatabaseConnection dbconn, String idPlayer) throws Exception {
		ResultSet are = dbconn.getActiveRosterEntries(idPlayer);
		if(are.next()) {
			closeErrantPlayerCase(dbconn, idPlayer, are.getString("id_assignment"), "Worker has not followed task instructions.");
			return true;
		}
		return false;
	}
	
	public static int processWaitingPlayers(DatabaseConnection dbconn, String idPlayer) throws Exception {
		String status = null;
		int statusKey = Constants.WAIT_DROP_NONE;
		Configuration conf = Configuration.getInstance();
		ResultSet wp = dbconn.getWaitingPlayers();
		while(wp.next()) {
			String idWaitingPlayer = wp.getString("id_player");
			if(idPlayer.equals(idWaitingPlayer)) {
				if(wp.getTimestamp("last_ping").getTime() - wp.getTimestamp("log_time").getTime() > (conf.getMinWaitingRoomTime()+1000)) {
					status = "Dropped out of waiting room after agreed minimum waiting time.";
					statusKey = Constants.WAIT_DROP_LEGAL;
					PlatformAPI.getInstance().approveAssignment(wp.getString("id_assignment"), status);
				} else {
					status = "Dropped out of waiting room before agreed minimum waiting time.";
					statusKey = Constants.WAIT_DROP_ILLEGAL;
					closeErrantPlayerCase(dbconn, wp.getString("id_player"), wp.getString("id_assignment"), status);
				}
				dbconn.processPlayer(wp.getString("id_player"), wp.getString("id_assignment"));
				dbconn.clearIpAddress(wp.getString("id_player"), wp.getString("id_assignment"));
			}
		}
		ResultSet iuepr = dbconn.getInactiveUnprocessedExpiredPlayerRecords(2 * conf.getWaitCycleTime());
		while(iuepr.next()) {
			if(iuepr.getTimestamp("last_ping").getTime() - iuepr.getTimestamp("log_time").getTime() > (conf.getMinWaitingRoomTime()+1000)) {
				if(iuepr.getString("id_player").equals(idPlayer)) {
					status = "Dropped out of waiting room after agreed minimum waiting time.";
					statusKey = Constants.WAIT_DROP_LEGAL;
				}
				PlatformAPI.getInstance().approveAssignment(iuepr.getString("id_assignment"), status);
			} else {
				if(iuepr.getString("id_player").equals(idPlayer)) {
					status = "Dropped out of waiting room before agreed minimum waiting time.";
					statusKey = Constants.WAIT_DROP_ILLEGAL;
				}
				closeErrantPlayerCase(dbconn, iuepr.getString("id_player"), iuepr.getString("id_assignment"), status);
			}
			dbconn.processPlayer(iuepr.getString("id_player"),iuepr.getString("id_assignment"));
			dbconn.clearIpAddress(iuepr.getString("id_player"), iuepr.getString("id_assignment"));
		}
		return statusKey;
	}
	
	public static int rejectIfBlockedOrOverplayed(DatabaseConnection dbconn, String idPlayer, String idAssignment) throws Exception {
		//String status = null;
		Configuration conf = Configuration.getInstance();
		int statusKey = Constants.LIMITS_WITHIN;
		if(conf.getMaxDropouts() > 0 && dbconn.countDropoutRecords(idPlayer) >= conf.getMaxDropouts()) {
			//status = "Dropped out too many times.";
			statusKey = Constants.LIMITS_DROPS;
		} else if(conf.getGamesPerPlayer() > 0 && dbconn.countRosterEntries(idPlayer) >= conf.getGamesPerPlayer()) {
			//status = "Played as many times as is permitted per worker.";
			statusKey = Constants.LIMITS_GAMES;
		}
		//if(statusKey != Constants.LIMITS_WITHIN) PlatformAPI.getInstance().rejectAssignment(idAssignment, status);
		return statusKey;
	}
	
	public static synchronized void setupGames(DatabaseConnection dbconn) throws Exception {
		Configuration conf = Configuration.getInstance();
		ResultSet wp = dbconn.getWaitingPlayers();
		Map<String,String> waitingList = new LinkedHashMap<String,String>();
		Set<String> addresses = new HashSet<String>();
		int i = 0;
		//For testing purposes ... if not prevention of co-located IPs is not enforced, make all IPs distinct in the following loop
		while(wp.next()) {
			if(!addresses.contains(wp.getString("ip_address")+(Constants.ENFORCE_IP_DISPERSAL?"":("_"+String.valueOf(i))))) {
				waitingList.put(wp.getString("id_assignment"),wp.getString("id_player"));
				addresses.add(wp.getString("ip_address")+(Constants.ENFORCE_IP_DISPERSAL?"":("_"+String.valueOf(i))));
			}
			i++;
		}
		if(waitingList.size() >= conf.getPlayersPerGame()) {
			int numRounds = 0;
			int maxRounds = conf.getMaxGameRounds();
			int minRounds = conf.getMinGameRounds();
			if(minRounds > maxRounds) {
				minRounds = maxRounds;
			}
			if(maxRounds == minRounds) {
				numRounds = maxRounds;
			} else {
				numRounds = minRounds + (new Random()).nextInt(maxRounds - minRounds + 1) ;
			}
			String idGame = String.valueOf((new Date()).getTime()) + String.valueOf((new Random()).nextInt(1000000));
			dbconn.newGame(idGame
					, numRounds, conf.getPlayersPerGame()
					, conf.getDDPayoff()
					, conf.getDCPayoff()
					, conf.getCDPayoff()
					, conf.getCCPayoff()
					, new Date(((new Date()).getTime())+conf.getReadyRoomTime()+conf.getWaitCycleTime())
					, conf.getRunLabel()
			);
			Iterator<String> assignments = waitingList.keySet().iterator();
			String idAssignment = null;
			int count = 0;
			while(assignments.hasNext() && count < conf.getPlayersPerGame()) {
				idAssignment = assignments.next();
				//System.out.println(count+"/"+conf.getPlayersPerGame() +":"+ idAssignment);
				dbconn.addToRoster(waitingList.get(idAssignment), idAssignment, idGame, ("PLAYER"+(++count)));
				dbconn.rosterPlayer(waitingList.get(idAssignment), idAssignment);
			}
		}
	}
	
	public static void newGamePhase(DatabaseConnection dbconn, String idGame, int round, String idPhase, Date endTime) {
		try {
			dbconn.newGamePhase(idGame, round, idPhase, endTime);
		} catch(Exception ex) {
			System.out.println(ex.getMessage());
		}
	}
	
	public static void closeErrantPlayerCase(DatabaseConnection dbconn, String idPlayer, String idAssignment, String reason) throws Exception {
		dbconn.deactivatePlayer(idPlayer);
		dbconn.deactivateRosterEntries(idPlayer);
		dbconn.processPlayer(idPlayer, idAssignment);
		rejectDropBlock(PlatformAPI.getInstance(), dbconn, idPlayer, idAssignment, reason);
	}
	
	/**
	 * Execute common sequence of API assignment reject, register as dropout, and block if over dropout limit
	 * @param api
	 * @param dbconn
	 * @param idPlayer
	 * @param idAssignment
	 * @param reason
	 */
	public static void rejectDropBlock(PlatformAPI api, DatabaseConnection dbconn, String idPlayer, String idAssignment, String reason) throws Exception {
		//api.rejectAssignment(idAssignment, reason);
		dbconn.registerAsDropout(idPlayer, idAssignment);
//		if(dbconn.countDropoutRecords(idPlayer) > Configuration.getInstance().getMaxDropouts()) {
//			api.blockWorker(idPlayer, "Worker has dropped out of too many tasks.");
//		}
	}
	
	/**
	 * Ensure that everyone in the round has acted. If not, execute abort sequence and return null. If so, return map of player ids to actions. 
	 * @param dbconn
	 * @param idGame
	 * @param round
	 * @return
	 * @throws SQLException
	 */
	public static Map<String,Boolean> validateRetrieveActions(DatabaseConnection dbconn, String idGame, int round) throws SQLException {
		ResultSet cr = dbconn.getActions(idGame, round);
		ResultSet r = dbconn.getRoster(idGame);
		Map<String,Boolean> actions = new TreeMap<String,Boolean>();
		while(cr.next()) {
			actions.put(cr.getString("id_player"), cr.getBoolean("action"));
		}
		if(actions.size() == 0) {
			return null;
		}
		Set<String> quitters = new HashSet<String>();
		while(r.next()) {
			if(!actions.keySet().contains(r.getString("id_player"))) {
				quitters.add(r.getString("id_player"));
			}
		}
		Iterator<String> iterQuitters = quitters.iterator();
		while(iterQuitters.hasNext()) {
			dbconn.deactivatePlayer(iterQuitters.next());
		}
		if(quitters.size() == 0) {
			return actions;
		} else {
			dbconn.deactivateGamePhases(idGame);
			return null;
		}
	}
	
	/**
	 * Get map of player ids to callsigns
	 * @param dbconn
	 * @param idGame
	 * @return
	 * @throws SQLException
	 */
	public static Map<String,String> getCallsigns(DatabaseConnection dbconn, String idGame) throws SQLException {
		ResultSet r = dbconn.getRoster(idGame);
		Map<String,String> roster = new TreeMap<String,String>();
		while(r.next()) {
			roster.put(r.getString("id_player"), r.getString("callsign"));
		}
		return roster;
	}
	
	/**
	 * Ensure that everyone has completed the quiz. 
	 * @param dbconn
	 * @param idGame
	 * @return
	 * @throws SQLException
	 */
	public static boolean validateRoster(DatabaseConnection dbconn, String idGame) throws SQLException {
		ResultSet rp = dbconn.getRosterPlayers(idGame);
		Set<String> quitters = new HashSet<String>();
		while(rp.next()) {
			if(!rp.getBoolean("active") && rp.getBoolean("rostered")) {
				quitters.add(rp.getString("id_player"));
			}
		}
		if(quitters.size() == 0) {
			return true;
		} else {
			dbconn.deactivateGamePhases(idGame);
			return false;
		}
	}
	
	public static String getJunkIpAddress() {
		return "127.0.0.1";//(new Random()).nextInt(1000)+"."+(new Random()).nextInt(1000)+"."+(new Random()).nextInt(1000)+"."+(new Random()).nextInt(1000);
	}
	
	public static double roundCash(double cash) {
		return ((double)Math.round(cash*100))/100;
	}
	
//	public static int submitAssignment(String idAssignment) throws Exception {
//		URL url = new URL(Configuration.getInstance().getSubmitUrl()+URLEncoder.encode(idAssignment,Constants.URL_ENCODING));
//		HttpURLConnection urlConn = (HttpURLConnection) url.openConnection();
//		int responseCode = urlConn.getResponseCode();
//		urlConn.disconnect();
//		return responseCode;
//	}
	
	public static double computeMaxBonusPerPlayer() throws Exception {
		Configuration conf = Configuration.getInstance();
		double perRound = conf.getDCPayoff();
		return Math.ceil(perRound*conf.getMaxGameRounds()*conf.getBonusPerEarnedToken());
	}
	
	public static long decayTime(long time, int round) {
		if(round <= 0) return time;
		double dtime = (double) time/1000; //seconds
//		double dround = (double) (Math.pow(round,2));
//		return ((long)(Math.floor(dtime * (dround+1)/dround)))*1000;
		double step = 3;
		if(round > step) return time;
		double dround = (double) round;
		return ((long)(Math.round(dtime * (1+(step-dround+1)/step))))*1000;
	}
	
	public static double getPayoff(String idPlayer, Map<String, Boolean> actions, double ddPayoff, double dcPayoff, double cdPayoff, double ccPayoff) {
		boolean action = actions.get(idPlayer);
		if(actions.containsValue(false)) {
			if(actions.containsValue(true)) {
				return action?cdPayoff:dcPayoff;
			} else {
				return ddPayoff;
			}
		} else {
			return ccPayoff;
		}
	}
	
	public static void main(String[] args)  throws Exception {
		for(int i = 1; i <= 10; i++) {
			System.out.println(i+":"+decayTime(10000,i));
		}
//		DatabaseConnection dbconn = null;
//		try {
//			dbconn = DatabaseConnection.getInstance();
//			Utilities.countdownWaitingRoom(dbconn, "23235345435", "3474374746");
//		} finally {
//			if(dbconn != null && dbconn.isConnected()) dbconn.closeConnection();
//		}
	}
	
}
