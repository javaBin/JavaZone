package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.TEXT_PLAIN;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.SessionsActivity;
import no.javazone.activities.ems.SpeakerService;
import no.javazone.representations.sessions.Session;
import no.javazone.representations.sessions.SimpleSession;

import org.joda.time.DateTime;

@Path("/sessions")
//@ResourceFilters(NoCacheResponseFilter.class)
public class SessionsResource {

	private final EmsService emsService = EmsService.getInstance();
	private final SpeakerService speakerService = SpeakerService.getInstance();
	private final SessionsActivity sessionsActivity = SessionsActivity.getInstance();

	@GET
	@Produces(APPLICATION_JSON)
	public Response getSimpleSessions() {
		List<SimpleSession> simpleSessions = sessionsActivity.getSimpleSessions();
		return Response.ok(simpleSessions).build();
	}

	@GET
	@Path("/{id}")
	@Produces(APPLICATION_JSON)
	public Response getSession(@PathParam("id") final String id) {
		Session session = sessionsActivity.getSession(id);
		return Response.ok(session).build();
	}

	@GET
	@Path("/refresh")
	@Produces(TEXT_PLAIN)
	public String refresh() {
		long bruktTidEms = emsService.refresh();
		long bruktTidSpeakers = speakerService.softRefresh();
		return String.format("%s: Sessions ble oppdatert fra EMS. Sessions+speakers tok %sms. Bilder tok %sms.\n",
				new DateTime().toString(), bruktTidEms, bruktTidSpeakers);
	}
}
