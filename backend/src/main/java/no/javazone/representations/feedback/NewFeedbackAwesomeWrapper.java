package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class NewFeedbackAwesomeWrapper {

	@JsonProperty
	private List<String> emails;
	@JsonProperty
	private List<String> conferenceFeedback;
	@JsonProperty
	private List<NewFeedbackAwesome> feedbacks;
	@JsonProperty
	private int redWebRatings;
	@JsonProperty
	private int yellowWebRatings;
	@JsonProperty
	private int greenWebRatings;
	@JsonProperty
	private double averageWebRatings;
	@JsonProperty
	private int redPaperRatings;
	@JsonProperty
	private int yellowPaperRatings;
	@JsonProperty
	private int greenPaperRatings;

	public NewFeedbackAwesomeWrapper(List<String> emails, List<String> conferenceFeedback, 
			int redWebRatings, int yellowWebRatings, int greenWebRatings, double averageWebRatings, 
			List<NewFeedbackAwesome> feedbacks,
			int redPaperRatings, int yellowPaperRatings, int greenPaperRatings) {
		this.yellowWebRatings = yellowWebRatings;
		this.redWebRatings = redWebRatings;
		this.emails = emails;
		this.conferenceFeedback = conferenceFeedback;
		this.greenWebRatings = greenWebRatings;
		this.averageWebRatings = averageWebRatings;
		this.feedbacks = feedbacks;
		this.redPaperRatings = redPaperRatings;
		this.yellowPaperRatings = yellowPaperRatings;
		this.greenPaperRatings = greenPaperRatings;
	}

}
