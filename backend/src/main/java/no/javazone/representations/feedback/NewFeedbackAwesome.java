package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class NewFeedbackAwesome {

	@JsonProperty
	private String id;
	@JsonProperty
	private String title;
	@JsonProperty
	private List<String> speakers;
	@JsonProperty
	private List<String> writtenFeedbacks;
	@JsonProperty
	private double numberOfRatingsWeb;
	@JsonProperty
	private double averageRatingWeb;
	@JsonProperty
	private int redPaperfeedback;
	@JsonProperty
	private int greenPaperfeedback;
	@JsonProperty
	private int yellowPaperfeedback;

	public NewFeedbackAwesome(String id, String title, List<String> speakers, List<String> writtenFeedbacks, 
			double numberOfRatings, double avg, int redPaperfeedback, int greenPaperfeedback, int yellowPaperfeedback) {
		this.id = id;
		this.title = title;
		this.speakers = speakers;
		this.writtenFeedbacks = writtenFeedbacks;
		this.numberOfRatingsWeb = numberOfRatings;
		this.averageRatingWeb = avg;
		this.redPaperfeedback = redPaperfeedback;
		this.greenPaperfeedback = greenPaperfeedback;
		this.yellowPaperfeedback = yellowPaperfeedback;
	}

}
