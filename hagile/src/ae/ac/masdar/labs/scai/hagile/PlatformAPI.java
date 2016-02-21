package ae.ac.masdar.labs.scai.hagile;

import com.amazonaws.mturk.service.axis.RequesterService;
import com.amazonaws.mturk.util.PropertiesClientConfig;

public class PlatformAPI {

	private static RequesterService service;
	
	private PlatformAPI() {
		if(service == null) {
			service = new RequesterService(new PropertiesClientConfig("beisicscc_mturk.properties"));
		}
	}
	
	public static PlatformAPI getInstance() {
		return new PlatformAPI();
	}
	
	public String approveAssignment(String idAssignment, String requesterFeedback) {
		try {
			if (Constants.ACTIVATE_API) {
				service.approveAssignment(idAssignment, requesterFeedback);
			}
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
	public String blockWorker(String workerId, String reason) {
		try {
			if (Constants.ACTIVATE_API) service.blockWorker(workerId, reason);
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
	public String rejectAssignment(String idAssignment, String requesterFeedback) {
		try {
			if (Constants.ACTIVATE_API) {
				service.rejectAssignment(idAssignment, requesterFeedback);
			}
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
	public String grantBonus(String workerId, double bonusAmount, String idAssignment, String reason) {
		try {
			if (Constants.ACTIVATE_API) service.grantBonus(workerId, Utilities.roundCash(bonusAmount), idAssignment, reason);
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
	public double getAccountBalance() {
		try {
			if (Constants.ACTIVATE_API) return service.getAccountBalance();
			else return Integer.MAX_VALUE;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return -1;
		}
	}
	
	public String expireIfBalanceUnder(String idHit, double expectedMaxPayout) {
		try {
			if (Constants.ACTIVATE_API) if(this.getAccountBalance() < expectedMaxPayout) {
				expireNow(idHit);
			}
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
	public String expireNow(String idHit) {
		try {
			if (Constants.ACTIVATE_API) {
				service.forceExpireHIT(idHit);
			}
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
	public double getReward(String idHit) {
		try {
			if (Constants.ACTIVATE_API) {
				return service.getHIT(idHit).getReward().getAmount().doubleValue();
			} else {
				return Configuration.getInstance().getParticipationReward();
			}
		} catch(Exception ex) {
			Utilities.logError(ex);
			return -1;
		}
	}
	
	public String notifyWorkers(String subject, String messageText, String[] workerId) {
		try {
			if (Constants.ACTIVATE_API) {
				service.notifyWorkers(subject, messageText, workerId);
			}
			return null;
		} catch(Exception ex) {
			Utilities.logError(ex);
			return ex.getClass().getSimpleName() + ":" + ex.getMessage();
		}
	}
	
}
