package no.javazone.representations.feedback;

import java.util.List;

import no.javazone.representations.sessions.Session;

import org.codehaus.jackson.annotate.JsonProperty;

public class FeedbackSummaryForSpeakers {

	@JsonProperty
	private final Session session;
	@JsonProperty
	private final int numRatings;
	@JsonProperty
	private final double avgRating;
	@JsonProperty
	private final double avgRatingForAllTalks;
	@JsonProperty
	private final List<String> comments;
	@JsonProperty
	private final String pageViews;

	public FeedbackSummaryForSpeakers(final Session session, final int numRatings, final double avgRating, final List<String> comments,
			final double avgRatingForAllTalks, final String pageViews) {
		this.session = session;
		this.numRatings = numRatings;
		this.avgRating = avgRating;
		this.comments = comments;
		this.avgRatingForAllTalks = avgRatingForAllTalks;
		this.pageViews = pageViews;
	}

}
