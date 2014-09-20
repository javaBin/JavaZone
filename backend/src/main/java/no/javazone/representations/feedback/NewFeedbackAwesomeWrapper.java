package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class NewFeedbackAwesomeWrapper {

	@JsonProperty
	private List<String> emails;
	@JsonProperty
	private List<String> conferenceFeedback;
	@JsonProperty
	private double totalNumberOfRatings;
	@JsonProperty
	private double conferenceAverageRating;
	@JsonProperty
	private List<NewFeedbackAwesome> feedbacks;

	public NewFeedbackAwesomeWrapper(List<String> emails, List<String> conferenceFeedback, double totalNumberOfRatings, double conferenceAverageRating, List<NewFeedbackAwesome> feedbacks) {
		this.emails = emails;
		this.conferenceFeedback = conferenceFeedback;
		this.totalNumberOfRatings = totalNumberOfRatings;
		this.conferenceAverageRating = conferenceAverageRating;
		this.feedbacks = feedbacks;
	}

}
