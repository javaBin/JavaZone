package no.javazone.activities.feedback.model;

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

public class NewFeedbackDbObject {

	public String time;
	public String id;
	public String value;
	public String ip;
	public String userAgent;

	public NewFeedbackDbObject(Object time, Object id, Object value, Object ip, Object userAgent) {
		this.time = (String) time;
		this.id = (String) id;
		this.value = (String) value;
		this.ip = (String) ip;
		this.userAgent = (String) userAgent;
	}
	
	
	
	
	public static ArrayList<NewFeedbackDbObject> convertFromMongo(List<DBObject> array) {
		return newArrayList(transform(array, new Function<DBObject, NewFeedbackDbObject>() {
			@Override
			public NewFeedbackDbObject apply(final DBObject dbObject) {
				Object time = dbObject.get("time");
				Object id = dbObject.get("id");
				Object value = dbObject.get("value");
				Object ip = dbObject.get("ip");
				Object userAgent = dbObject.get("userAgent");

				return new NewFeedbackDbObject(time, id, value, ip, userAgent);
			}
		}));
	}
}
