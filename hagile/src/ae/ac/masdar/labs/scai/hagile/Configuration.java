package ae.ac.masdar.labs.scai.hagile;

import java.util.*;

public class Configuration {

	private static Configuration config = null;

	// Declaring properties variables..
	private int gamesPerPlayer;
	private int playersPerGame;
	private int maxGameRounds;
	private int minGameRounds;
	private long waitCycleTime;
	private long minWaitingRoomTime;
	private long readyRoomTime;
	private long actionPhaseTime;
	private long reviewPhaseTime;
	private double bonusPerEarnedToken;
	private double ccPayoff;
	private double ddPayoff;
	private double cdPayoff;
	private double dcPayoff;
	private int maxDropouts;
	private long syncDelayTime;
	private double minBalancePerGame;
	private double participationReward;
	private String errorPage;
	private String abortPage;
	private String dbUrl;
	private String dbUsername;
	private String dbPassword;
	private String submitUrl;
	private String runLabel;

	// Private Class Constructor...
	private Configuration() throws Exception {
		
		// Read properties file.
		Properties properties = new Properties();
		properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("/config.properties"));
		//properties.load(new FileInputStream(new File("config.properties")));
		
		//Initialize Configuration Variables */	
		String gpp = properties.getProperty("gamesPerPlayer");
		gamesPerPlayer = Integer.parseInt(gpp);

		String ppg = properties.getProperty("playersPerGame");
		playersPerGame = Integer.parseInt(ppg);
		
		String mgr = properties.getProperty("maxGameRounds");
		maxGameRounds = Integer.parseInt(mgr);
		
		String mingr = properties.getProperty("minGameRounds");
		minGameRounds = Integer.parseInt(mingr);
		
		String wct = properties.getProperty("waitCycleTime");
		waitCycleTime = Long.parseLong(wct);
		
		String minwrt = properties.getProperty("minWaitingRoomTime");
		minWaitingRoomTime = Long.parseLong(minwrt);
		
		String rrt = properties.getProperty("readyRoomTime");
		readyRoomTime = Long.parseLong(rrt);
		
		String apt = properties.getProperty("actionPhaseTime");
		actionPhaseTime = Long.parseLong(apt);
		
		String rpt = properties.getProperty("reviewPhaseTime");
		reviewPhaseTime = Long.parseLong(rpt);
		
		String bpet = properties.getProperty("bonusPerEarnedToken");
		bonusPerEarnedToken = Double.parseDouble(bpet);

		errorPage = properties.getProperty("errorPage");

		abortPage = properties.getProperty("abortPage");
		
		String ccp = properties.getProperty("ccPayoff");
		ccPayoff = Double.parseDouble(ccp);
		
		String dp = properties.getProperty("ddPayoff");
		ddPayoff = Double.parseDouble(dp);
		
		String cdp = properties.getProperty("cdPayoff");
		cdPayoff = Double.parseDouble(cdp);
		
		String dcp = properties.getProperty("dcPayoff");
		dcPayoff = Double.parseDouble(dcp);
		
		String md = properties.getProperty("maxDropouts");
		maxDropouts = Integer.parseInt(md);
		
		String sdt = properties.getProperty("syncDelayTime");
		syncDelayTime = Long.parseLong(sdt);
		
		String mb = properties.getProperty("minBalancePerGame");
		minBalancePerGame = Double.parseDouble(mb);
		
		String pr = properties.getProperty("participationReward");
		participationReward = Double.parseDouble(pr);
		
		dbUrl = properties.getProperty("dbUrl");
		
		dbUsername = properties.getProperty("dbUsername");
		
		dbPassword = properties.getProperty("dbPassword");
		
		submitUrl = properties.getProperty("submitUrl");
		
		runLabel = properties.getProperty("runLabel");
	}
	
	public String getErrorPage() {
		return errorPage;
	}

	public String getAbortPage() {
		return abortPage;
	}

	// Getters for the properties variables...
	public int getGamesPerPlayer() {
		return gamesPerPlayer;
	}
	
	public int getPlayersPerGame() {
		return playersPerGame;
	}
	
	public int getMaxGameRounds() {
		return maxGameRounds;
	}
	
	public int getMinGameRounds() {
		return minGameRounds;
	}
	
	public long getWaitCycleTime() {
		return waitCycleTime;
	}
	
	public long getMinWaitingRoomTime() {
		return minWaitingRoomTime;
	}
	
	public long getReadyRoomTime() {
		return readyRoomTime;
	}
	
	public long getActionPhaseTime() {
		return actionPhaseTime;
	}
	
	public long getReviewPhaseTime() {
		return reviewPhaseTime;
	}
	
	public double getBonusPerEarnedToken() {
		return bonusPerEarnedToken;
	}
	
	public double getCCPayoff() {
		return ccPayoff;
	}
	
	public double getDDPayoff() {
		return ddPayoff;
	}
	
	public double getCDPayoff() {
		return cdPayoff;
	}
	
	public double getDCPayoff() {
		return dcPayoff;
	}
	
	public int getMaxDropouts() {
		return maxDropouts;
	}
	
	public long getSyncDelayTime() {
		return syncDelayTime;
	}
	
	public double getMinBalancePerGame() {
		return minBalancePerGame;
	}	
	
	public double getParticipationReward() {
		return participationReward;
	}	
	
	public String getDbUrl() {
		return dbUrl;
	}

	public String getDbUsername() {
		return dbUsername;
	}

	public String getDbPassword() {
		return dbPassword;
	}

	public String getSubmitUrl() {
		return submitUrl;
	}

	public String getRunLabel() {
		return runLabel;
	}

	// To get a singleton object
	public static Configuration getInstance() throws Exception {
		if (config == null){
			config = new Configuration();
		}
		return config;
	}

public static void main(String [] args) throws Exception {
	//printConfigurations();
	Configuration con = getInstance();
	System.out.println("--List Of Properties--"+ "\nGames Per Player = " + con.gamesPerPlayer +
			"\nPlayers Per Game= " +con.playersPerGame +
			"\nMaximum Game Rounds= "+ con.maxGameRounds + "\nMinimum Game Rounds= "+ con.minGameRounds +
			"\nWait Cycle Time= "+ con.waitCycleTime+ "\nMinimum WaitingRoom Time= "+ con.minWaitingRoomTime + 
			"\nReadyRoom Time= "+ con.readyRoomTime+ "\nAction Phase Time= "+ con.actionPhaseTime
			+ "\nReview Phase Time= "+ con.reviewPhaseTime +
			"\nBonus Per EarnedToken= " + con.bonusPerEarnedToken +
			"\nError Page= " + con.errorPage  + "\nAbort Page= " + con.abortPage  +
			"\nCC Payoff= " + con.ccPayoff +
			"\nDD Payoff= " + con.ddPayoff +
			"\nCD Payoff= " + con.cdPayoff +
			"\nDC Payoff= " + con.dcPayoff +
			"\nMax Dropouts= " + con.maxDropouts +
			"\nSync Delay Time= " + con.syncDelayTime  +"\nMinimum Balance= " + con.minBalancePerGame +"\n\nDB URL= " + con.dbUrl +
			"\nDB Username= " + con.dbUsername  +"\nDB Password= " + con.dbPassword);
}

}

/*


public class Configuration {
	private static Configuration config = null;
	private Configuration() {
	}
	public static Configuration getInstance() {
		if(config == null) {
			config = new Configuration();
		}
		return config;
	}
	public int getGamesPerPlayer() { return -1; }
	public int getPlayersPerGame() { return -1; }
	public int getMaxGameRounds() { return -1; }
	public int getMeanGameRounds() { return -1; }
	public double getBudgetPerRound() { return -1; }
	public long getWaitCycleTime() { return -1; }
	public long getMinWaitingRoomTime() { return -1; }
	public long getReadyRoomTime() { return -1; }
	public long getContributionPhaseTime() { return -1; }
	public long getInteractionPhaseTime() { return -1; }
	public long getSummaryPhaseTime() { return -1; }
	public double getParticipationReward() { return -1; }
	public double getBonusPerEarnedToken() { return -1; }
	public String getInterventionMode() { return null; }
	public double getInterventionEffect() { return -1; }
	public String getInteractionMode() { return null; }
	public double getInteractionEffect() { return -1; }
	public double getInteractionCost() { return -1; }
	public double getSystemReward() { return -1; }
	public int getMaxDropouts() { return -1; }
	public long getSyncDelayTime() { return -1; }
	public double getMinBalance() { return -1; }
}
*/