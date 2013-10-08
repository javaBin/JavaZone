package no.javazone.activities.ems.model;

import java.util.List;

import org.joda.time.DateTime;

public class ConferenceYear {

	private final List<EmsSession> sessions;

	private final DateTime lastTimeRefreshed;

	public ConferenceYear(final List<EmsSession> sessions, final DateTime lastTimeRefreshed) {
		this.sessions = sessions;
		this.lastTimeRefreshed = lastTimeRefreshed;
	}

	public List<EmsSession> getSessions() {
		return sessions;
	}

	public DateTime getLastTimeRefreshed() {
		return lastTimeRefreshed;
	}

}
