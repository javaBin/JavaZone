package no.javazone.representations.twitter;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;
import org.joda.time.DateTime;

public class TwitterList {

	@JsonProperty
	private final DateTime tidHentetFraTwitter;
	@JsonProperty
	private final List<Tweet> tweets;

	public TwitterList(final DateTime tidHentetFraTwitter, final List<Tweet> tweets) {
		this.tidHentetFraTwitter = tidHentetFraTwitter;
		this.tweets = tweets;
	}

	public DateTime getTidHentetFraTwitter() {
		return tidHentetFraTwitter;
	}

	public List<Tweet> getTweets() {
		return tweets;
	}

	public boolean erNyereEnnMinutter(final int minutter) {
		return !tidHentetFraTwitter.isBefore(new DateTime().minusMinutes(minutter));
	}

}
