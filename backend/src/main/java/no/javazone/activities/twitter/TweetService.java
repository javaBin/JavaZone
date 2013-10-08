package no.javazone.activities.twitter;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Lists.transform;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import no.javazone.representations.Feilmelding;
import no.javazone.representations.twitter.Tweet;
import no.javazone.representations.twitter.TwitterList;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.RateLimitStatus;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.StatusUpdate;
import twitter4j.Twitter;
import twitter4j.TwitterException;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;

public class TweetService {

	private static final Logger LOG = LoggerFactory.getLogger(TweetService.class);

	private static final int CACHE_TID_MINUTTER = 10;
	private final Map<String, TwitterList> cache = new ConcurrentHashMap<String, TwitterList>();
	private TwitterList egneTweetsCache;

	private static TweetService tweetServiceSingelton;

	private final Twitter twitter;

	public TweetService() {
		twitter = TwitterPalogger.hentTwitterObjekt();
	}

	public TwitterList søk(final String søkeord) {
		try {
			QueryResult result = twitter.search(new Query(søkeord));

			ArrayList<Tweet> tweets = statusListToTweets(result.getTweets());

			return new TwitterList(new DateTime(), tweets);
		} catch (TwitterException e) {
			throw loggFeilOgKastFeilmelding(e);
		}
	}

	public TwitterList søkMedCache(final String søkeord) {
		TwitterList cachetListe = cache.get(søkeord);
		if (cachetListe != null && cachetListe.erNyereEnnMinutter(CACHE_TID_MINUTTER)) {
			return cachetListe;
		} else {
			LOG.info("Søk på " + søkeord + " fantes ikke i cache, eller var over " + CACHE_TID_MINUTTER
					+ " minutt gammel. Søker mot twitter...");
			TwitterList twitterList = søk(søkeord);
			cache.put(søkeord, twitterList);
			return twitterList;
		}
	}

	public TwitterList hentEgneTweets() {
		try {
			ResponseList<Status> userTimeline = twitter.getUserTimeline();
			List<Tweet> fetchedTweets = statusListToTweets(userTimeline);
			List<Tweet> filteredTweets = newArrayList(Collections2.filter(fetchedTweets, Tweet.notRetweetsOrAttTweets()));
			return new TwitterList(new DateTime(), filteredTweets);
		} catch (TwitterException e) {
			throw loggFeilOgKastFeilmelding(e);
		}
	}

	public TwitterList hentEgneTweetsCached() {
		if (egneTweetsCache != null && egneTweetsCache.erNyereEnnMinutter(CACHE_TID_MINUTTER)) {
			return egneTweetsCache;
		} else {
			LOG.info("Egne tweets fantes ikke i cache, eller var over " + CACHE_TID_MINUTTER + " minutt gammel. Henter fra twitter...");
			try {
				egneTweetsCache = hentEgneTweets();
			} catch (WebApplicationException e) {
				// Hvis vi får feilmelding, så logges det, men vi sender ut
				// cache versjon hvis vi har :)
				if (egneTweetsCache == null) {
					throw e;
				}
			}
			return egneTweetsCache;
		}
	}

	public Map<String, RateLimitStatus> ratelimit() {
		try {
			return twitter.getRateLimitStatus();
		} catch (TwitterException e) {
			throw loggFeilOgKastFeilmelding(e);
		}
	}

	public void post(final String melding) {
		try {
			StatusUpdate statusUpdate = new StatusUpdate(melding);
			twitter.updateStatus(statusUpdate);
		} catch (TwitterException e) {
			throw loggFeilOgKastFeilmelding(e);
		}
	}

	// TODO: bruke noe annet enn singelton-patternet!
	public static TweetService getInstance() {
		if (tweetServiceSingelton == null) {
			tweetServiceSingelton = new TweetService();
		}
		return tweetServiceSingelton;
	}

	private ArrayList<Tweet> statusListToTweets(final List<Status> list) {
		ArrayList<Tweet> tweets = newArrayList(transform(list, new Function<Status, Tweet>() {
			@Override
			public Tweet apply(final Status status) {
				return new Tweet(status.getCreatedAt(), status.getUser().getScreenName(), status.getText(), generateLink(status));
			}

			private String generateLink(final Status status) {
				return "https://twitter.com/javazone/status/" + status.getId();
			}
		}));
		return tweets;
	}

	private WebApplicationException loggFeilOgKastFeilmelding(final TwitterException e) {
		LOG.warn("Fikk feil fra twitter!", e);
		return new WebApplicationException(Response.serverError().entity(new Feilmelding("Fikk feil fra twitter")).build());
	}
}
