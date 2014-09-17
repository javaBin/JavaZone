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

public class NewFeedbackObjectOut {

	@JsonProperty
	private Object time;
	@JsonProperty
	private Object id;
	@JsonProperty
	private Object value;
	@JsonProperty
	private Object ip;
	@JsonProperty
	private Object userAgent;
	@JsonProperty
	private Object title;
	@JsonProperty
	private List<String> speakers;

	public NewFeedbackObjectOut(Object time, Object id, Object value, Object ip, Object userAgent, Object title, List<String> speakers) {
		this.time = time;
		this.id = id;
		this.value = value;
		this.ip = ip;
		this.userAgent = userAgent;
		this.title = title;
		this.speakers = speakers;
	}
}
