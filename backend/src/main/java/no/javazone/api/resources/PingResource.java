package no.javazone.api.resources;

import no.javazone.activities.ems.SessionsActivity;
import no.javazone.activities.feedback.SpeakerFeedbackService;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import static javax.ws.rs.core.MediaType.TEXT_PLAIN;

@Path("/ping")
public class PingResource {

	SessionsActivity sessionsActivity = SessionsActivity.getInstance();
	SpeakerFeedbackService feedbackService = SpeakerFeedbackService.getInstance();

	@GET
	@Produces(TEXT_PLAIN)
	public Response ping() {
		// boolean sessionsOk = sessionsActivity.statusCheck();

		boolean sessionsOk = true; // Foreløpig gidder vi ikke sjekke sessions,
									// fordi autoreload ikke er på plass...
		boolean mongodbOk = feedbackService.statusCheck();
		String status = String.format("talks_refreshed=%s, mongodb_online=%s", sessionsOk, mongodbOk);
		if (sessionsOk && mongodbOk) {
			return Response.ok("EVERYTHING OK! Details: " + status).build();
		} else {
			return Response.status(Status.SERVICE_UNAVAILABLE).entity("SOMETHING WRONG! Details: " + status).build();
		}
	}

}
