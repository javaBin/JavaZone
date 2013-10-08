package no.javazone.representations.feedback;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class FeedbackSummaryForSpeakers {

	@JsonProperty
	private final int numRatings;
	@JsonProperty
	private final double avgRating;
	@JsonProperty
	private final List<String> comments;

	public FeedbackSummaryForSpeakers(final int numRatings, final double avgRating, final List<String> comments) {
		this.numRatings = numRatings;
		this.avgRating = avgRating;
		this.comments = comments;
	}

}
