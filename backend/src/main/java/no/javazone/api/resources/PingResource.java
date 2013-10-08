package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.TEXT_PLAIN;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import no.javazone.activities.ems.SessionsActivity;
import no.javazone.activities.feedback.SpeakerFeedbackService;

@Path("/ping")
public class PingResource {

	SessionsActivity sessionsActivity = SessionsActivity.getInstance();
	SpeakerFeedbackService feedbackService = SpeakerFeedbackService.getInstance();

	@GET
	@Produces(TEXT_PLAIN)
	public Response ping() {
		boolean sessionsOk = sessionsActivity.statusCheck();
		boolean feedbackOk = feedbackService.statusCheck();
		String status = String.format("Status:\n\nSession refresh ok: %s\nMongo ok: %s", sessionsOk, feedbackOk);
		if (sessionsOk && feedbackOk) {
			return Response.ok(status).build();
		} else {
			return Response.status(Status.SERVICE_UNAVAILABLE).entity(status).build();
		}
	}

}
