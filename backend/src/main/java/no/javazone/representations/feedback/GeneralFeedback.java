package no.javazone.representations.feedback;

import java.util.Map;
import java.util.Map.Entry;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;
import org.joda.time.DateTime;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class GeneralFeedback {

	@JsonProperty
	public final Map<String, String> feedback;

	@JsonCreator
	public GeneralFeedback(@JsonProperty("feedback") final Map<String, String> feedback) {
		this.feedback = feedback;
	}

	@Override
	public String toString() {
		return "GeneralFeedback [feedback=" + feedback + "]";
	}

	public boolean validate() {
		for (Entry<String, String> entry : feedback.entrySet()) {
			if (entry.getKey().length() > 1000 || entry.getValue().length() > 10000 || entry.getKey().contains(".")) {
				return false;
			}
		}
		return true;
	}

	public static DBObject toMongoObject(final GeneralFeedback feedback, final String ip, final String userAgent) {
		BasicDBObject feedbackObject = new BasicDBObject();
		for (Entry<String, String> entry : feedback.feedback.entrySet()) {
			feedbackObject.append(entry.getKey(), entry.getValue());
		}
		return new BasicDBObject()
				.append("feedback", feedbackObject)
				.append("time", DateTime.now().toString())
				.append("ip", ip)
				.append("userAgent", userAgent);
	}

}
