package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import no.javazone.activities.feedback.GeneralFeedbackService;
import no.javazone.representations.feedback.GeneralFeedback;

@Path("/generalfeedback")
//@ResourceFilters(NoCacheResponseFilter.class)
public class GeneralFeedbackResource {

	private final GeneralFeedbackService feedbackService = GeneralFeedbackService.getInstance();

	@POST
	@Produces(APPLICATION_JSON)
	@Consumes(APPLICATION_JSON)
	public Response postNewFeedback(@HeaderParam("X-Forwarded-For") final String ip, @HeaderParam("User-Agent") final String userAgent,
			final GeneralFeedback feedback) {
		feedbackService.addGeneralFeedback(ip, userAgent, feedback);
		return Response.ok().build();
	}
}
