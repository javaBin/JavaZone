package no.javazone.representations.feedback;

import no.javazone.activities.ems.model.EmsSession;

import no.javazone.activities.ems.EmsService;
import com.google.common.base.Function;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;
import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;
import org.joda.time.DateTime;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class NewFeedbackOut {
	
	private static final EmsService emsService = EmsService.getInstance();

	@JsonProperty
	public final List<NewFeedbackObjectOut> feedback;

	@JsonCreator
	public NewFeedbackOut(@JsonProperty("feedback") final List<NewFeedbackObjectOut> feedback) {
		this.feedback = feedback;
	}

	@Override
	public String toString() {
		return "NewFeedbackOut [feedback=" + feedback + "]";
	}

	public boolean validate() {
		return true;
	}

	public static NewFeedbackOut convertFromMongo(List<DBObject> dbOjects) {
		ArrayList<NewFeedbackObjectOut> list = newArrayList(transform(dbOjects, new Function<DBObject, NewFeedbackObjectOut>() {
			@Override
			public NewFeedbackObjectOut apply(final DBObject dbObject) {
				Object time = dbObject.get("time");
				Object id = dbObject.get("id");
				Object value = dbObject.get("value");
				Object ip = dbObject.get("ip");
				Object userAgent = dbObject.get("userAgent");
				
				Object title = "";
				List<String> speakers = null;
				
				EmsSession session = emsService.getSession((String) id);
				if(session != null) {
					title = session.getTitle();
					speakers = session.getSpeakerNames();
				}

				return new NewFeedbackObjectOut(time, id, value, ip, userAgent, title, speakers);
			}
		}));
		return new NewFeedbackOut(list);
	}

}
