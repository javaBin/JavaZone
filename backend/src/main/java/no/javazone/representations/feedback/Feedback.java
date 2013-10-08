package no.javazone.representations.feedback;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;
import org.joda.time.DateTime;

import com.google.common.base.Function;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class Feedback {

	@JsonProperty
	public final Integer rating;
	@JsonProperty
	public final String comment;

	@JsonCreator
	public Feedback(@JsonProperty("rating") final Integer rating, @JsonProperty("comment") final String comment) {
		this.rating = rating;
		this.comment = comment;
	}

	public boolean validate() {
		if (rating != null && (rating < 1 || rating > 3)) {
			return false;
		}
		if (comment != null && comment.length() > 10000) {
			return false;
		} else {
			return true;
		}
	}

	public static ArrayList<Feedback> convertFromMongo(final List<DBObject> feedbacksFromDb) {
		return newArrayList(transform(feedbacksFromDb, new Function<DBObject, Feedback>() {
			@Override
			public Feedback apply(final DBObject dbObject) {
				// HALLELUJA, dette kan da ikke være nødvendig? Må da finnes en
				// bedre måte å hente ut på! FIX NOW =)
				Integer rating;
				try {
					Object ratingObj = dbObject.get("rating");
					if (ratingObj == null) {
						rating = null;
					} else {
						rating = Integer.parseInt(ratingObj.toString());
					}
				} catch (NumberFormatException e) {
					rating = null;
				}

				Object commentObj = dbObject.get("comment");
				String comment = commentObj != null ? commentObj.toString() : null;
				return new Feedback(rating, comment);
			}
		}));
	}

	public static DBObject toMongoObject(final Feedback feedback, final String talkId, final String ip, final String userAgent) {
		return new BasicDBObject()
				.append("time", DateTime.now().toString())
				.append("talkId", talkId)
				.append("rating", feedback.rating)
				.append("comment", feedback.comment)
				.append("ip", ip)
				.append("userAgent", userAgent);
	}

}
