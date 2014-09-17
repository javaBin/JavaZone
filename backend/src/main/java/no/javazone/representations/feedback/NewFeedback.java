package no.javazone.representations.feedback;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;
import org.joda.time.DateTime;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

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
