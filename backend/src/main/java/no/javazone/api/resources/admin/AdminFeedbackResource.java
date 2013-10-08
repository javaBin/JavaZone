package no.javazone.api.resources.admin;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import no.javazone.activities.feedback.SpeakerFeedbackService;
import no.javazone.api.filters.NoCacheResponseFilter;
import no.javazone.representations.feedback.Feedback;
import no.javazone.server.PropertiesLoader;

import com.sun.jersey.spi.container.ResourceFilters;

@Path("/admin/feedback")
@ResourceFilters(NoCacheResponseFilter.class)
public class AdminFeedbackResource {

	private final SpeakerFeedbackService feedbackService = SpeakerFeedbackService.getInstance();

	@GET
	@Produces(APPLICATION_JSON)
	public Response getAllFeedbacks(@HeaderParam("X-Jz-Secret") final String secret) {
		checkSecret(secret);
		Map<String, List<Feedback>> feedbacks = feedbackService.getAllFeedbacks();
		return Response.ok(feedbacks).build();
	}

	@GET
	@Path("/{talkId}")
	@Produces(APPLICATION_JSON)
	public Response getFeedbacksFor(@HeaderParam("X-Jz-Secret") final String secret, @PathParam("talkId") final String talkId) {
		checkSecret(secret);
		List<Feedback> feedbacks = feedbackService.getFeedbacksForTalk(talkId);
		return Response.ok(feedbacks).build();
	}

	@GET
	@Path("/{talkId}/summary")
	@Produces(APPLICATION_JSON)
	public Response getSummaryFor(@HeaderParam("X-Jz-Secret") final String secret, @PathParam("talkId") final String talkId) {
		checkSecret(secret);
		String s = feedbackService.getSummaryForTalk(talkId);
		return Response.ok(s).build();
	}

	private void checkSecret(final String secret) {
		if (secret == null || !secret.equals(PropertiesLoader.getProperty("api.secret"))) {
			throw new WebApplicationException(Status.FORBIDDEN);
		}
	}

}
