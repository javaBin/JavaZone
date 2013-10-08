package no.javazone.api.resources.admin;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import no.javazone.activities.feedback.GeneralFeedbackService;
import no.javazone.api.filters.NoCacheResponseFilter;
import no.javazone.representations.feedback.AdminGeneralFeedback;
import no.javazone.server.PropertiesLoader;

import com.sun.jersey.spi.container.ResourceFilters;

@Path("/admin/generalfeedback")
@ResourceFilters(NoCacheResponseFilter.class)
public class AdminGeneralFeedbackResource {

	private final GeneralFeedbackService feedbackService = GeneralFeedbackService.getInstance();

	@GET
	@Produces(APPLICATION_JSON)
	public Response getAllFeedbacks(@HeaderParam("X-Jz-Secret") final String secret) {
		checkSecret(secret);
		List<AdminGeneralFeedback> feedbacks = feedbackService.getAllFeedbacks();
		return Response.ok(feedbacks).build();
	}

	private void checkSecret(final String secret) {
		if (secret == null || !secret.equals(PropertiesLoader.getProperty("api.secret"))) {
			throw new WebApplicationException(Status.FORBIDDEN);
		}
	}

}
