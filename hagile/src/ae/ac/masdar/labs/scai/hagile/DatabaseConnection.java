package ae.ac.masdar.labs.scai.hagile;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;

import net.sf.javainetlocator.InetAddressLocator;
import net.sf.javainetlocator.InetAddressLocatorException;

public class DatabaseConnection{
	private Connection conn;
	
	//private static DatabaseConnection dbconn; // for now, get new connection each time
	
	private List<PreparedStatement> accounting = new ArrayList<PreparedStatement>();

	//======================================CORE METHODS==========================================================
	
	private void getConnection() throws RuntimeException, IOException {
		try{
			Configuration conf = Configuration.getInstance();
			String username = conf.getDbUsername();
			String password = conf.getDbPassword();
			String url = conf.getDbUrl();
			//System.out.println("Connecting to "+url+" using "+username+"/"+password);
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection (url, username, password);
		} catch (Exception e){
			throw new RuntimeException("Cannot connect to database!", e);
		}
	}
	
	public boolean isConnected() {
		try {
			return (conn != null && !conn.isClosed());
		} catch(Exception ex) {
			Utilities.logger.warn("isConnected():"+ex.getMessage(),ex);
			return false;
		}
	}
	
	public boolean closeConnection() {
		if(isConnected()) {
			try {
				for(PreparedStatement ps : accounting) {
					if(ps != null && !ps.isClosed()) ps.close();
				}
				conn.close();
			} catch(Exception ex) {
				Utilities.logger.warn("closeConnection():"+ex.getMessage(),ex);
				return true;
			}
			return true;
		} else {
			return false;
		}
	}
	
	public static DatabaseConnection getInstance() throws RuntimeException, IOException {
		DatabaseConnection dbconn = new DatabaseConnection();
		dbconn.getConnection();
		return dbconn;
	}

	//==================================DML METHODS===============================================================
	
	public int logTaskBrowser(String ipAddress, String idHit) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO browsing (ip_address, id_hit) VALUES (?, ?);");
			ps.setString(1, ipAddress);
			ps.setString(2, idHit);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int logFeedback(String idPlayer, String idGame, String question, String answer) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO feedback (id_player, id_game, question, answer) VALUES (?, ?, ?, ?);");
			ps.setString(1, idPlayer);
			ps.setString(2, idGame);
			ps.setString(3, question);
			ps.setString(4, answer);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int deactivateGame (String idGame) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE games SET active='0' WHERE (id_game = ?)");
			ps.setString(1, idGame);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}

	public int newPlayer(String ipAddress, String idHit, String idPlayer, String idAssignment, Boolean contactable, String hostname) throws SQLException {
		PreparedStatement ps = null;
		try {
			String countryCode  = null;
			try {
				InetAddress inetAddress = InetAddress.getByName(hostname);
				try {
					countryCode = InetAddressLocator.getLocale(inetAddress).getCountry();
				} catch (InetAddressLocatorException ialEx) {
					Utilities.logError(ialEx);
				}
			} catch(UnknownHostException uhEx) {
				Utilities.logError(uhEx);
			}
			ps = conn.prepareStatement("INSERT INTO players (ip_address, id_hit, id_player, id_assignment, contactable, country_code, last_ping) VALUES (?,?,?,?,?,?, CURRENT_TIMESTAMP)");
			ps.setString(1, ipAddress);
			ps.setString(2, idHit);
			ps.setString(3, idPlayer);
			ps.setString(4, idAssignment);
			//ps.setTimestamp(5, new Timestamp((new java.util.Date()).getTime()));
			if(contactable == null) {
				ps.setNull(5, Types.BOOLEAN);
			} else {
				ps.setBoolean(5, contactable);
			}
			if(countryCode == null) {
				ps.setNull(6, Types.CHAR);
			} else {
				ps.setString(6, countryCode);
			}
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int addToRoster(String idPlayer, String idAssignment, String idGame, String callSign) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO roster (id_player, id_assignment, id_game, callsign) VALUES (?, ?, ?, ?)");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			ps.setString(3, idGame);
			ps.setString(4, callSign);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int registerAsDropout(String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO dropout (id_player, id_assignment) VALUES (?, ?)");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int logAction(String idPlayer, String idGame, int round, boolean action) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO actions (id_game, round, id_player, action) VALUES (?, ?, ?, ?)");
			ps.setString(1, idGame);
			ps.setInt(2, round);
			ps.setString(3, idPlayer);
			ps.setBoolean(4, action);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int logEarnings(String idGame, int round, String idPlayer, double earnings) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO payments (id_game, round, id_player, earning) VALUES (?, ?, ?, ?)");
			ps.setString(1, idGame);
			ps.setInt(2, round);
			ps.setString(3, idPlayer);
			ps.setDouble(4, earnings);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int logParticipationReward(String idGame, String idPlayer, double participationReward) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO payments (id_game, round, id_player, payout) VALUES (?, ?, ?, ?)");
			ps.setString(1, idGame);
			ps.setInt(2, 0);
			ps.setString(3, idPlayer);
			ps.setDouble(4, participationReward);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int deactivateGamePhase(String idGame, int round, String idPhase) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE gameplay SET active = 0 WHERE id_game = ? AND round = ? AND id_phase = ?");
			ps.setString(1, idGame);
			ps.setInt(2, round);
			ps.setString(3, idPhase);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int deactivateGamePhases(String idGame) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE gameplay SET active = 0 WHERE id_game = ?");
			ps.setString(1, idGame);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}

	public int processPlayer(String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE players SET processed = 1 WHERE id_player = ? and id_assignment = ?");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int rosterPlayer(String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE players SET rostered = 1 WHERE id_player = ? and id_assignment = ?");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int deactivateRosterEntries(String idPlayer) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE roster SET active = 0 WHERE id_player= ?");
			ps.setString(1, idPlayer);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int updateLastPing(String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE players SET last_ping = CURRENT_TIMESTAMP WHERE id_player = ? and id_assignment = ?");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}

	public int newGame(String idGame, int numRounds, int numPlayers, double ddPayoff, double dcPayoff, double cdPayoff, double ccPayoff, java.util.Date startTime, String idRun) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO games (id_game, num_rounds, num_players, dd_payoff, dc_payoff, cd_payoff, cc_payoff, start_time, id_run) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
			ps.setString(1, idGame);
			ps.setInt(2, numRounds);
			ps.setInt(3, numPlayers);
			ps.setDouble(4, ddPayoff);
			ps.setDouble(5, dcPayoff);
			ps.setDouble(6, cdPayoff);
			ps.setDouble(7, ccPayoff);
			ps.setTimestamp(8, new Timestamp(startTime.getTime()));
			ps.setString(9, idRun);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int newGamePhase(String idGame, int round, String idPhase, java.util.Date endTime) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("INSERT INTO gameplay (id_game, round, id_phase, end_time) VALUES (?, ?, ?, ?)");
			ps.setString(1, idGame);
			ps.setInt(2, round);
			ps.setString(3, idPhase);
			ps.setTimestamp(4, new Timestamp(endTime.getTime()));
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int activatePlayer (String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE players SET active = 1 WHERE id_player = ? and id_assignment = ?");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int deactivatePlayer(String idPlayer) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE players SET active = 0 WHERE id_player = ?");
			ps.setString(1, idPlayer);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int logPayout(String idGame, int round, String idPlayer, double payout) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE payments SET payout = ? WHERE id_game = ? and round = ? and id_player = ?");
			ps.setDouble(1, payout);
			ps.setString(2, idGame);
			ps.setInt(3, round);
			ps.setString(4, idPlayer);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	
	public int clearIpAddress(String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("UPDATE players SET ip_address = NULL WHERE id_player = ? and id_assignment = ?");
			ps.setString(1, idPlayer);
			ps.setString(2, idAssignment);
			return ps.executeUpdate();
		} finally {
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}	

	//==================================SPECIAL RETRIEVAL METHODS=================================================
	
	public int getRosterCount(String idGame) throws SQLException {
		ResultSet rs = null;
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("SELECT count(*) as num FROM roster WHERE id_game = ?");
			ps.setString(1, idGame);
			rs = ps.executeQuery();
			rs.next();
			return rs.getInt(1);
		} finally {
			if(rs != null && !rs.isClosed()) rs.close();
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}

	public int countRosterEntries(String idPlayer) throws SQLException {
		ResultSet rs = null;
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("SELECT count(*) as num FROM roster WHERE id_player = ? and id_game in (select distinct gp.id_game from gameplay gp where gp.id_phase = 'SUMMARY' and round=(select g.num_rounds from games g where g.id_game = gp.id_game))");
//			ps = conn.prepareStatement("SELECT count(*) as num FROM roster WHERE id_player = ?");
			ps.setString(1, idPlayer);
			rs = ps.executeQuery();
			rs.next();
			return rs.getInt(1);
		} finally {
			if(rs != null && !rs.isClosed()) rs.close();
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}


 	public int countActiveGames() throws SQLException {
		ResultSet rs = null;
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("SELECT count(*) as num FROM games WHERE active = 1");
			rs = ps.executeQuery();
			rs.next();
			return rs.getInt(1);
		} finally {
			if(rs != null && !rs.isClosed()) rs.close();
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}

	public int countDropoutRecords(String idPlayer) throws SQLException {
		ResultSet rs = null;
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement("SELECT count(*) num FROM dropout WHERE id_player = ?");
			ps.setString(1, idPlayer);
			rs = ps.executeQuery();
			rs.next();
			return rs.getInt(1);
		} finally {
			if(rs != null && !rs.isClosed()) rs.close();
			if(ps != null && !ps.isClosed()) ps.close();
		}
	}
	   
	//==================================QUERY METHODS=======================================

	public ResultSet getActiveExpiredGamePhases(long expiryTime) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM gameplay WHERE active = 1 and end_time < ?");
		ps.setTimestamp(1, new Timestamp(new java.util.Date().getTime() - expiryTime));
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getInactiveUnprocessedExpiredPlayerRecords(long expiryTime) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM players WHERE active = 0 and processed = 0 and last_ping < ?");
		ps.setTimestamp(1, new Timestamp(new java.util.Date().getTime() - expiryTime));
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getActiveRosterEntries(String idPlayer) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT roster.id_game as id_game, id_assignment, start_time, callsign FROM roster, games WHERE roster.id_game = games.id_game and roster.active = 1 and roster.id_player = ?");
		ps.setString(1, idPlayer);
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getWaitingPlayers() throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM players WHERE active = 0 and processed = 0 and rostered = 0");
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getGameRecord(String idGame) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM games WHERE id_game = ?");
		ps.setString(1, idGame);
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getRoster(String idGame) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT roster.id_game, roster.id_player, roster.id_assignment, roster.callsign, players.active FROM roster, players WHERE roster.id_game = ?");
		ps.setString(1, idGame);
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getRosterPlayers(String idGame) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT players.* FROM roster, players WHERE roster.id_game = ? and roster.id_player = players.id_player and roster.id_assignment = players.id_assignment");
		ps.setString(1, idGame);
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getActions(String idGame, int round) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM actions WHERE id_game = ? and round = ?");
		ps.setString(1, idGame);
		ps.setInt(2, round);
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getPlayerRecord(String idPlayer, String idAssignment) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM players WHERE id_player = ? and id_assignment = ?");
		ps.setString(1, idPlayer);
		ps.setString(2, idAssignment);
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	public ResultSet getEarnings(String idGame, String idPlayer) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT * FROM payments WHERE id_game = ? and id_player = ?");
		ps.setString(1, idGame);
		ps.setString(2, idPlayer);
		accounting.add(ps);
		return ps.executeQuery();
	}

	public ResultSet getActiveRecords(String idPlayer, int round, String idGame, String idPhase) throws SQLException {
		PreparedStatement ps = null;
		ps = conn.prepareStatement("SELECT id_assignment, dd_payoff, dc_payoff, cd_payoff, cc_payoff, end_time, callsign, num_rounds, num_players" +
				" FROM games, gameplay, roster" +
				" WHERE roster.id_player = ? and gameplay.round = ? and games.id_game = ? and gameplay.id_phase = ?" +
				" and roster.id_game = games.id_game and gameplay.id_game = games.id_game and gameplay.id_game = games.id_game");
		ps.setString(1, idPlayer);
		ps.setInt(2, round);
		ps.setString(3, idGame);
		ps.setString(4, idPhase);
		accounting.add(ps);
		return ps.executeQuery();
	}

	public ResultSet getPanel(String whereClause) throws SQLException {
		PreparedStatement ps = null;
		whereClause = " "+whereClause.replace('\n', ' ');
		whereClause = whereClause.replace('\t', ' ');
		whereClause = whereClause.replace(';', ' ');
		whereClause = whereClause.replace('"', ' ');
		ps = conn.prepareStatement("SELECT id_player,contactable FROM players" + whereClause + " order by log_time");
		accounting.add(ps);
		return ps.executeQuery();
	}
	
	//==================================MAIN METHOD=========================================
	public static void main (String[] args) throws SQLException {
		DatabaseConnection dbconn = null;
		try {
			dbconn = DatabaseConnection.getInstance();
			/*dbconn.newGame("453434534", 45, 345.055, "gdggdefgv", "dfgdfgdfg", new java.util.Date());
			dbconn.newGame("453434134", 45, 345.055, "gdggdefgv", "dfgdfgdfg", new java.util.Date());
			dbconn.newGame("453434234", 45, 345.055, "gdggdefgv", "dfgdfgdfg", new java.util.Date());
			ResultSet rs = dbconn.getGameRecord("453434134");
			rs.next();
			System.out.println(rs.getString("id_game"));*/
			//dbconn.logTaskBrowser("127.0.0.1", "sdfgsdfgs");
			ResultSet rs = dbconn.getWaitingPlayers();
			while (rs.next()) System.out.println(rs.getString("id_player"));
			rs.close();
			System.out.println("==============");
			rs = dbconn.getInactiveUnprocessedExpiredPlayerRecords(Configuration.getInstance().getWaitCycleTime()*2);
			while (rs.next()) System.out.println(">>> "+rs.getString("id_player"));
			rs.close();
		} catch (Exception e){
			e.printStackTrace();
		} finally {
			if(dbconn != null && dbconn.isConnected()) {
				dbconn.closeConnection();
			}
		}
	}
}

