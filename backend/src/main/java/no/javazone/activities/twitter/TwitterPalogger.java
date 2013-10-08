package no.javazone.activities.twitter;

import no.javazone.server.PropertiesLoader;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;

public class TwitterPalogger {
	public static Twitter hentTwitterObjekt() {
		TwitterFactory factory = new TwitterFactory();
		Twitter twitter = factory.getInstance();
		twitter.setOAuthConsumer(PropertiesLoader.getProperty("twitter.customer.key"),
				PropertiesLoader.getProperty("twitter.customer.secret"));
		twitter.setOAuthAccessToken(new AccessToken(PropertiesLoader.getProperty("twitter.user.token"), PropertiesLoader
				.getProperty("twitter.user.token.secret")));
		return twitter;
	}
}
