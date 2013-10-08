package no.javazone.representations.twitter;

import java.util.Date;

import no.javazone.utils.TimeUtil;

import org.codehaus.jackson.annotate.JsonProperty;

import com.google.common.base.Predicate;

public class Tweet {

	@JsonProperty
	private final Date date;
	@JsonProperty
	private final String relativeDate;
	@JsonProperty
	private final String user;
	@JsonProperty
	private final String tweet;
	@JsonProperty
	private final String link;

	public Tweet(final Date date, final String user, final String tweet, final String link) {
		this.date = date;
		this.user = user;
		this.tweet = tweet;
		this.link = link;

		relativeDate = TimeUtil.generateRelativeDate(date.getTime());
	}

	public String getUser() {
		return user;
	}

	public String getTweet() {
		return tweet;
	}

	public static Predicate<Tweet> notRetweetsOrAttTweets() {
		return new Predicate<Tweet>() {
			@Override
			public boolean apply(final Tweet tweet) {
				return !tweet.getTweet().startsWith("RT") && !tweet.getTweet().startsWith("@");
			}
		};
	}

}
