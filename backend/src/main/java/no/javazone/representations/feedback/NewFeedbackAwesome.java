package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class NewFeedbackAwesome {

	@JsonProperty
	private String id;
	@JsonProperty
	private String secret;
	@JsonProperty
	private String title;
	@JsonProperty
	private List<String> speakers;
	@JsonProperty
	private List<String> speakerEmails;
	@JsonProperty
	private List<String> writtenFeedbacks;
	@JsonProperty
	private int redPaperfeedback;
	@JsonProperty
	private int greenPaperfeedback;
	@JsonProperty
	private int yellowPaperfeedback;
	@JsonProperty
	private int redWeb;
	@JsonProperty
	private int yellowWeb;
	@JsonProperty
	private int greenWeb;
	@JsonProperty
	private double avgWeb;

	public NewFeedbackAwesome(String id, String secret, String title, List<String> speakers, List<String> speakerEmails, List<String> writtenFeedbacks, 
			int redWeb, int yellowWeb, int greenWeb, double avgWeb,
			int redPaperfeedback, int greenPaperfeedback, int yellowPaperfeedback) {
		this.id = id;
		this.secret = secret;
		this.title = title;
		this.speakers = speakers;
		this.speakerEmails = speakerEmails;
		this.writtenFeedbacks = writtenFeedbacks;
		this.redWeb = redWeb;
		this.yellowWeb = yellowWeb;
		this.greenWeb = greenWeb;
		this.avgWeb = avgWeb;
		this.redPaperfeedback = redPaperfeedback;
		this.greenPaperfeedback = greenPaperfeedback;
		this.yellowPaperfeedback = yellowPaperfeedback;
	}

}