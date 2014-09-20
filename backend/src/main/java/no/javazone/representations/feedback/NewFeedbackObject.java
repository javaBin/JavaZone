package no.javazone.representations.feedback;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;
import org.joda.time.DateTime;

public class NewFeedbackObject {

	@JsonProperty
	public final String id;
	@JsonProperty
	public final String value;

	@JsonCreator
	public NewFeedbackObject(@JsonProperty("id") final String id, @JsonProperty("value") final String value) {
		this.id = id;
		this.value = value;
	}

	@Override
	public String toString() {
		return "NewFeedbackObject [id=" + id + ", value=" + value + "]";
	}

	public static DBObject toMongoObject(NewFeedbackObject f, String ip, String userAgent) {
		return new BasicDBObject()
		.append("time", DateTime.now().toString())
		.append("id", f.id)
		.append("value", f.value)
		.append("ip", ip)
		.append("userAgent", userAgent);
	}
	
//	public boolean validate() {
//		if (rating != null && (rating < 1 || rating > 3)) {
//			return false;
//		}
//		if (comment != null && comment.length() > 10000) {
//			return false;
//		} else {
//			return true;
//		}
//	}
//
//	public static ArrayList<NewFeedbackObject> convertFromMongo(final List<DBObject> feedbacksFromDb) {
//		return newArrayList(transform(feedbacksFromDb, new Function<DBObject, NewFeedbackObject>() {
//			@Override
//			public NewFeedbackObject apply(final DBObject dbObject) {
//				// HALLELUJA, dette kan da ikke være nødvendig? Må da finnes en
//				// bedre måte å hente ut på! FIX NOW =)
//				Integer rating;
//				try {
//					Object ratingObj = dbObject.get("rating");
//					if (ratingObj == null) {
//						rating = null;
//					} else {
//						rating = Integer.parseInt(ratingObj.toString());
//					}
//				} catch (NumberFormatException e) {
//					rating = null;
//				}
//
//				Object commentObj = dbObject.get("comment");
//				String comment = commentObj != null ? commentObj.toString() : null;
//				Object objectId = dbObject.get("_id");
//				System.out.println(objectId);
//				String id = objectId.toString();
//				return new NewFeedbackObject(id, rating, comment);
//			}
//		}));
//	}
//
//	public static DBObject toMongoObject(final NewFeedbackObject feedback, final String talkId, final String ip, final String userAgent) {
//		return new BasicDBObject()
//				.append("time", DateTime.now().toString())
//				.append("talkId", talkId)
//				.append("rating", feedback.rating)
//				.append("comment", feedback.comment)
//				.append("ip", ip)
//				.append("userAgent", userAgent);
//	}

}
