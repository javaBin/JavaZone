package no.javazone.representations.feedback;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class FeedbackSummaryForSpeakers {

	@JsonProperty
	public final List<Feedback> details;

	public FeedbackSummaryForSpeakers(final List<Feedback> details) {
		this.details = details;
	}

}
