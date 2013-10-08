package no.javazone.api.resources.restricted;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import no.javazone.activities.feedback.SpeakerFeedbackService;
import no.javazone.api.filters.NoCacheResponseFilter;
import no.javazone.representations.feedback.FeedbackSummaryForSpeakers;

import com.sun.jersey.spi.container.ResourceFilters;

@Path("/restricted/feedback")
@ResourceFilters(NoCacheResponseFilter.class)
public class RestrictedSpeakerFeedbackResource {

	private final SpeakerFeedbackService feedbackService = SpeakerFeedbackService.getInstance();

	@GET
	@Path("/{talkId}")
	@Produces(APPLICATION_JSON)
	public Response getAllFeedbacks(@PathParam("talkId") final String talkId, @QueryParam("secret") final String secret) {
		FeedbackSummaryForSpeakers feedback = feedbackService.getSpeakersOwnFeedbackSummary(talkId, secret);
		return Response.ok(feedback).build();
	}

}
