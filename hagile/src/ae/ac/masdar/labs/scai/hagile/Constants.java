package ae.ac.masdar.labs.scai.hagile;

public class Constants {

	public static final String ADMIN_CODE = "45064U5049ijgBigvjEfo0ivME0b8J35gb94j";
	
	//Test Mode Switches
	public static final boolean ENFORCE_IP_DISPERSAL = false;
	public static final boolean ACTIVATE_API = false;
//	public static final boolean ENFORCE_IP_DISPERSAL = true;
//	public static final boolean ACTIVATE_API = true;
	
//	public static final boolean CHECK_QUIZ = false;
//	public static final boolean FULL_INTRO = false;
	public static final boolean CHECK_QUIZ = true;
	public static final boolean FULL_INTRO = true;

//	public static final boolean HIDE_ERROR = false;
	public static final boolean HIDE_ERROR = true;
	
	public static final String ASSN_ID_NA = "ASSIGNMENT_ID_NOT_AVAILABLE";
	
	//Phase codes
	public static final String PHASE_ACTION = "CONTRIBUTION";
	public static final String PHASE_REVIEW = "INTERVENTION";
	
	//Intervention mode codes
	public static final String INTERVENTION_NONE = "NONE";
	public static final String INTERVENTION_DR = "DIRECT_REWARD";
	public static final String INTERVENTION_DP = "DIRECT_PUNISH";
	public static final String INTERVENTION_SR = "SOCIAL_REWARD";
	public static final String INTERVENTION_SP = "SOCIAL_PUNISH";
	
	//Interaction mode codes
	public static final String INTERACTION_R = "PEER_REWARD";
	public static final String INTERACTION_P = "PEER_PUNISH";
	public static final String INTERACTION_RP = "PEER_REWARD_PUNISH";
	
	//Interaction action codes
	public static final String EFFECT_IGNORE = "IGNORE";
	public static final String EFFECT_PUNISH = "PUNISH";
	public static final String EFFECT_REWARD = "REWARD";
	
	//Request attribute code for message to error page
	public static final String ATTR_ERROR = "ERROR_MESSAGE";
	public static final String ATTR_NAV = "NAV_PHASE";
	
	//Time at which the counter goes red
	public static final long CRITICAL_TIME = 10000;
	
	//Waiting room drop-out status keys
	public static final int WAIT_DROP_NONE = 0;
	public static final int WAIT_DROP_ILLEGAL = 1;
	public static final int WAIT_DROP_LEGAL = 2;
	
	//status for too many drop-outs and games
	public static final int LIMITS_WITHIN = 0;
	public static final int LIMITS_DROPS = 1;
	public static final int LIMITS_GAMES = 2;
	
	public static final String URL_ENCODING = "UTF-8";
	
	public static final String TIMEOUT_QUESTION = "TIMEOUT";
	
}
