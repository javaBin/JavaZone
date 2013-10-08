package no.javazone.representations.feedback;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

import com.google.common.base.Function;
import com.mongodb.DBObject;

public class AdminGeneralFeedback {

	@JsonProperty
	private final Object time;
	@JsonProperty
	private final Object ip;
	@JsonProperty
	private final Object userAgent;
	@JsonProperty
	private final Object feedback;

	public AdminGeneralFeedback(final Object time, final Object ip, final Object userAgent, final Object feedback) {
		this.time = time;
		this.ip = ip;
		this.userAgent = userAgent;
		this.feedback = feedback;
	}

	public static ArrayList<AdminGeneralFeedback> convertFromMongo(final List<DBObject> feedbacksFromDb) {
		return newArrayList(transform(feedbacksFromDb, new Function<DBObject, AdminGeneralFeedback>() {
			@Override
			public AdminGeneralFeedback apply(final DBObject dbObject) {
				Object time = dbObject.get("time");
				Object ip = dbObject.get("ip");
				Object userAgent = dbObject.get("userAgent");
				Object feedback = dbObject.get("feedback");

				return new AdminGeneralFeedback(time, ip, userAgent, feedback);
			}
		}));
	}

}
