package no.javazone.api.resources;

import static javax.ws.rs.core.MediaType.TEXT_PLAIN;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/")
//@ResourceFilters(NoCacheResponseFilter.class)
public class RootResource {

	@GET
	@Produces(TEXT_PLAIN)
	public Response ping() {
		return Response.ok("I'm alive :)").build();
	}

}
