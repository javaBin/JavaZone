package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class NewFeedbackAwesomeWrapper {

	@JsonProperty
	private List<NewFeedbackAwesome> feedbacks;

	public NewFeedbackAwesomeWrapper(List<NewFeedbackAwesome> feedbacks) {
		this.feedbacks = feedbacks;
	}

}
