package no.javazone.activities.ems;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.Status;

import no.javazone.activities.ems.model.ConferenceYear;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.representations.sessions.AdminSimpleSession;
import no.javazone.representations.sessions.Session;
import no.javazone.representations.sessions.SimpleSession;

import org.joda.time.DateTime;

public class SessionsActivity {

	private static SessionsActivity instance;

	private final EmsService emsService = EmsService.getInstance();

	private SessionsActivity() {
	}

	public List<SimpleSession> getSimpleSessions() {
		ConferenceYear conferenceYear = emsService.getConferenceYear();
		return newArrayList(transform(conferenceYear.getSessions(), SimpleSession.emsSessionToSimpleSession()));
	}

	public static SessionsActivity getInstance() {
		if (instance == null) {
			instance = new SessionsActivity();
		}
		return instance;
	}

	public Session getSession(final String id) {
		EmsSession emsSession = emsService.getSession(id);
		if (emsSession == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		return Session.createSession(emsSession);
	}

	public List<AdminSimpleSession> getSimpleSessionsAdmin() {
		ConferenceYear conferenceYear = emsService.getConferenceYear();
		return newArrayList(transform(conferenceYear.getSessions(), AdminSimpleSession.emsSessionToAdminSimpleSession()));
	}

	public boolean statusCheck() {
		return emsService.getConferenceYear().getLastTimeRefreshed().isAfter(DateTime.now().minusMinutes(10));
	}
}
