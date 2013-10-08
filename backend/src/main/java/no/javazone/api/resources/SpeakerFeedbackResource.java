package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import no.javazone.activities.feedback.SpeakerFeedbackService;
import no.javazone.api.filters.NoCacheResponseFilter;
import no.javazone.representations.feedback.Feedback;

import com.sun.jersey.spi.container.ResourceFilters;

@Path("/feedback")
@ResourceFilters(NoCacheResponseFilter.class)
public class SpeakerFeedbackResource {

	private final SpeakerFeedbackService feedbackService = SpeakerFeedbackService.getInstance();

	@POST
	@Path("/{talkId}")
	@Produces(APPLICATION_JSON)
	@Consumes(APPLICATION_JSON)
	public Response postNewFeedback(@PathParam("talkId") final String talkId, @HeaderParam("X-Forwarded-For") final String ip,
			@HeaderParam("User-Agent") final String userAgent, final Feedback feedback) {
		feedbackService.addFeedbackForTalk(talkId, ip, userAgent, feedback);
		return Response.ok().build();
	}
}
