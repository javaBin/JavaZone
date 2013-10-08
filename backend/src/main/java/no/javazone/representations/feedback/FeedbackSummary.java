package no.javazone.representations.feedback;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class FeedbackSummary {

	@JsonProperty
	public final int numRatings;
	@JsonProperty
	public final double avgRating;
	@JsonProperty
	public final List<String> comments;
	@JsonProperty
	public final List<AdminFeedback> details;

	public FeedbackSummary(final int numRatings, final double avgRating, final List<String> comments, final List<AdminFeedback> details) {
		this.numRatings = numRatings;
		this.avgRating = avgRating;
		this.comments = comments;
		this.details = details;
	}

}
