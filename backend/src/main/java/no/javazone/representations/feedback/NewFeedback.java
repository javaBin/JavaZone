package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class NewFeedback {

	@JsonProperty
	public final List<NewFeedbackObject> feedback;

	@JsonCreator
	public NewFeedback(@JsonProperty("feedback") final List<NewFeedbackObject> feedback) {
		this.feedback = feedback;
	}

	@Override
	public String toString() {
		return "NewFeedback [feedback=" + feedback + "]";
	}

	public boolean validate() {
		return true;
	}

}
