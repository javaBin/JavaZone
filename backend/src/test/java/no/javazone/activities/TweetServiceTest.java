package no.javazone.activities;

import java.util.List;
import java.util.Map;

import no.javazone.activities.twitter.TweetService;
import no.javazone.representations.twitter.Tweet;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import twitter4j.RateLimitStatus;

@Ignore
public class TweetServiceTest {

	private TweetService tweetService;

	@Before
	public void setUp() {
		tweetService = new TweetService();
	}

	@Test
	public void skalHenteTweets() {
		System.out.println("TWEETS");
		List<Tweet> tweets = tweetService.søk("digipost").getTweets();
		for (Tweet tweet : tweets) {
			System.out.println("@" + tweet.getUser() + ": " + tweet.getTweet());
		}
		System.out.println("TWEETS DONE\n");
	}

	@Test
	public void skalHenteRateLimit() {
		System.out.println("RATELIMIT");
		Map<String, RateLimitStatus> ratelimits = tweetService.ratelimit();
		for (String key : ratelimits.keySet()) {
			RateLimitStatus status = ratelimits.get(key);
			System.out.println(key + " - " + status.getLimit() + " - " + status.getRemaining() + " - " + status.getSecondsUntilReset());
		}
		System.out.println("RATELIMIT DONE\n");
	}

	@Test
	@Ignore
	public void skalPosteTweet() {
		System.out.println("POSTE TWEET");
		tweetService.post("Twitrer litt fra Java-kode da sjø. Mekker twitter-API... :P Testing, testing...");
		System.out.println("POSTE TWEET DONE");
	}
}
