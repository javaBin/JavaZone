package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

public class NewFeedbackAwesomeWrapperSingle {

	@JsonProperty
	private NewFeedbackAwesome feedback;
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

	public NewFeedbackAwesomeWrapperSingle(
			int redWebRatings, int yellowWebRatings, int greenWebRatings, double averageWebRatings, 
			NewFeedbackAwesome feedback,
			int redPaperRatings, int yellowPaperRatings, int greenPaperRatings) {
		this.yellowWebRatings = yellowWebRatings;
		this.redWebRatings = redWebRatings;
		this.greenWebRatings = greenWebRatings;
		this.averageWebRatings = averageWebRatings;
		this.feedback = feedback;
		this.redPaperRatings = redPaperRatings;
		this.yellowPaperRatings = yellowPaperRatings;
		this.greenPaperRatings = greenPaperRatings;
	}

}