package no.javazone.activities.wordpress;

import no.javazone.representations.wordpress.Bloggposter;
import no.javazone.server.PropertiesLoader;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class WordpressService {

	private static final Logger LOG = LoggerFactory.getLogger(WordpressService.class);

	private static final String POSTS_URL = "/posts/";

	private static final int CACHELEVETID_MINUTTER = 1;

	private static WordpressService instance;

	private final Client jerseyClient;
	private final String rootUrl;

	private Bloggposter bloggpostCache;
	private DateTime tidHentet;

	private WordpressService() {
		ClientConfig config = new DefaultClientConfig();
		config.getClasses().add(JacksonJsonProvider.class);
		jerseyClient = Client.create(config);
		rootUrl = PropertiesLoader.getProperty("wordpress.rooturl");
	}

	public Bloggposter hentBloggposter() {
		return jerseyClient.resource(rootUrl + POSTS_URL).get(Bloggposter.class);
	}

	public Bloggposter hentBloggposterCachet() {
		if (tidHentet == null || tidHentet.isBefore(new DateTime().minusMinutes(CACHELEVETID_MINUTTER))) {
			LOG.info("Henter bloggposter fordi cachen har gått ut. Cachetid minutter=" + CACHELEVETID_MINUTTER);
			bloggpostCache = hentBloggposter();
			tidHentet = new DateTime();
		}
		return bloggpostCache;
	}

	public static WordpressService getInstance() {
		if (instance == null) {
			instance = new WordpressService();
		}
		return instance;
	}
}
