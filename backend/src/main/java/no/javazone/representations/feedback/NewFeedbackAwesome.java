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

	public NewFeedbackAwesome(String id, String title, List<String> speakers, List<String> writtenFeedbacks, double numberOfRatings, double avg) {
		this.id = id;
		this.title = title;
		this.speakers = speakers;
		this.writtenFeedbacks = writtenFeedbacks;
		this.numberOfRatingsWeb = numberOfRatings;
		this.averageRatingWeb = avg;
	}

}
