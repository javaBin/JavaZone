package no.javazone.utils;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;

public class TwitterTokenInitialiserer {

	private static final Logger LOG = LoggerFactory.getLogger(TwitterTokenInitialiserer.class);
	private static final String CUSTOMER_KEY = "FYLLINN";
	private static final String CUSTOMER_SECRET = "FYLLINN";

	public static void main(final String[] args) throws TwitterException, IOException {
		Twitter twitter = TwitterFactory.getSingleton();
		twitter.setOAuthConsumer(CUSTOMER_KEY, CUSTOMER_SECRET);
		RequestToken requestToken = twitter.getOAuthRequestToken();
		AccessToken accessToken = null;
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		while (null == accessToken) {
			System.out.println("Open the following URL and grant access to your account:");
			System.out.println(requestToken.getAuthorizationURL());
			System.out.print("Enter the PIN(if aviailable) or just hit enter.[PIN]:");
			String pin = br.readLine();
			try {
				if (pin.length() > 0) {
					accessToken = twitter.getOAuthAccessToken(requestToken, pin);
				} else {
					accessToken = twitter.getOAuthAccessToken();
				}
			} catch (TwitterException te) {
				if (401 == te.getStatusCode()) {
					System.out.println("Unable to get the access token.");
				} else {
					te.printStackTrace();
				}
			}
		}
		outputAccessToken(twitter.verifyCredentials().getId(), accessToken);
	}

	private static void outputAccessToken(final long id, final AccessToken accessToken) throws IOException {
		FileOutputStream fout = new FileOutputStream("/Users/eh/twitter/token.txt");
		ObjectOutputStream oos = new ObjectOutputStream(fout);
		oos.writeObject(accessToken);
		oos.close();
		LOG.info("ID=" + id + " token=" + accessToken.getToken() + " secret=" + accessToken.getTokenSecret());
	}
}
