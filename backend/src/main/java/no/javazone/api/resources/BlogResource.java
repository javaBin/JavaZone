package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import no.javazone.activities.wordpress.WordpressService;
import no.javazone.api.filters.NoCacheResponseFilter;
import no.javazone.representations.wordpress.Bloggpost;

import org.apache.commons.lang3.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.spi.container.ResourceFilters;

@Path("/blog")
@ResourceFilters(NoCacheResponseFilter.class)
public class BlogResource {

	private static final Logger LOG = LoggerFactory.getLogger(BlogResource.class);

	private final WordpressService wordpressService = WordpressService.getInstance();

	@GET
	@Produces(APPLICATION_JSON)
	public Response getBlogposts() {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();

		List<Bloggpost> poster = wordpressService.hentBloggposterCachet().getPosts();

		stopWatch.stop();

		LOG.info("Henting av bloggposter tok " + stopWatch.getTime() + "ms");
		return Response.ok(poster).build();

	}

}
