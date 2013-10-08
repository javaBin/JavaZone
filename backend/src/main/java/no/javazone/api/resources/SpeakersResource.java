package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.TEXT_PLAIN;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import no.javazone.activities.ems.SpeakerService;
import no.javazone.api.filters.FiveMinutesCacheResponseFilter;

import org.joda.time.DateTime;

import com.sun.jersey.spi.container.ResourceFilters;

@Path("/speakers")
@ResourceFilters(FiveMinutesCacheResponseFilter.class)
public class SpeakersResource {

	private final SpeakerService speakerService = SpeakerService.getInstance();

	@GET
	@Path("/{speakerId}/image")
	@Produces("image/png")
	public Response getSessionImage(@PathParam("speakerId") final String speakerId, @QueryParam("s") final String size,
			@QueryParam("d") final String gravatarFallbackType) {
		return speakerService.getImageForSpeaker(speakerId, size, gravatarFallbackType);
	}

	@GET
	@Path("/refresh")
	@Produces(TEXT_PLAIN)
	public String refresh() {
		long bruktTidSpeakers = speakerService.forceRefresh();
		return String.format("%s: Refreshet bilder på %sms.\n", new DateTime().toString(), bruktTidSpeakers);
	}
}
