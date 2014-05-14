package no.javazone.server;

import java.io.IOException;
import java.net.URI;

import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.SpeakerService;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class WebServerMain {
    public static final String BASE_URI = "http://localhost:";

	private static final Logger LOG = LoggerFactory.getLogger(WebServerMain.class);

	public static void main(final String[] args) {
		try {
			PropertiesLoader.initialize();
			int port = Integer.parseInt(PropertiesLoader.getProperty("server.port"));
			
			final HttpServer server = startServer(port);
			System.out.println(String.format("Jersey app started with WADL available at "
			        + "%s/application.wadl\nHit enter to stop it...", BASE_URI + port));
			//doStartupTasks();
			System.in.read();
			server.stop();
		} catch (NumberFormatException | IOException e) {
			e.printStackTrace();
		}
	}
	
    public static HttpServer startServer(int port) {
        final ResourceConfig rc = new ResourceConfig().packages("no.javazone.api");
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI + port), rc);
    }


	private static void doStartupTasks() {
		EmsService.getInstance().refresh();

		String property = System.getProperty("loadSessionsOnStartup", "true");
		if (property.equals("true")) {
			SpeakerService.getInstance().forceRefresh();
		} else {
			LOG.warn("Laster IKKE sessionbilder pga propertyen loadSessionsOnStartup != true");
		}
	}
}
