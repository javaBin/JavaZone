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

//	public boolean validate() {
//		for (Entry<String, String> entry : feedback.entrySet()) {
//			if (entry.getKey().length() > 1000 || entry.getValue().length() > 10000 || entry.getKey().contains(".")) {
//				return false;
//			}
//		}
//		return true;
//	}
//
//	public static DBObject toMongoObject(final NewFeedback feedback, final String ip, final String userAgent) {
//		BasicDBObject feedbackObject = new BasicDBObject();
//		for (Entry<String, String> entry : feedback.feedback.entrySet()) {
//			feedbackObject.append(entry.getKey(), entry.getValue());
//		}
//		return new BasicDBObject()
//				.append("feedback", feedbackObject)
//				.append("time", DateTime.now().toString())
//				.append("ip", ip)
//				.append("userAgent", userAgent);
//	}

}
