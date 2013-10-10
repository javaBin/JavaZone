package no.javazone.representations.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import com.mongodb.DBObject;

public class AdminFeedback {

	@JsonProperty
	private final Object id;
	@JsonProperty
	private final Object time;
	@JsonProperty
	private final Object rating;
	@JsonProperty
	private final Object comment;
	@JsonProperty
	private final Object ip;
	@JsonProperty
	private final Object userAgent;

	public AdminFeedback(final Object id, final Object time, final Object rating, final Object comment, final Object ip,
			final Object userAgent) {
		this.id = id;
		this.time = time;
		this.rating = rating;
		this.comment = comment;
		this.ip = ip;
		this.userAgent = userAgent;
	}

	public static AdminFeedback fromDbObject(final DBObject o) {
		Object id = o.get("_id").toString();
		Object time = o.get("time");
		Object rating = o.get("rating");
		Object comment = o.get("comment");
		Object ip = o.get("ip");
		Object userAgent = o.get("userAgent");
		return new AdminFeedback(id, time, rating, comment, ip, userAgent);
	}

}
