package no.javazone.activities.feedback;

import com.google.common.base.Function;
import com.google.common.base.Predicate;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.activities.feedback.model.NewFeedbackDbObject;
import no.javazone.representations.feedback.NewFeedback;
import no.javazone.representations.feedback.NewFeedbackAwesome;
import no.javazone.representations.feedback.NewFeedbackAwesomeWrapper;
import no.javazone.representations.feedback.NewFeedbackObject;
import no.javazone.server.PropertiesLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import static com.google.common.collect.Collections2.filter;
import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

public class NewFeedbackService {

	private static final Logger LOG = LoggerFactory.getLogger(NewFeedbackService.class);

	EmsService emsService = EmsService.getInstance();

	public static NewFeedbackService instance;
	private DBCollection feedbackMongoCollection;

	public NewFeedbackService() {
		MongoClient mongoClient;
		try {
			mongoClient = new MongoClient("localhost", 27017);
			String namespace = PropertiesLoader.getProperty("mongodb.namespace");
			DB db = mongoClient.getDB(namespace);
			feedbackMongoCollection = db.getCollection("newfeedback");
		} catch (UnknownHostException e) {
			LOG.warn("Kunne ikke starte MongoDB-klient!", e);
		}
	}

	public static NewFeedbackService getInstance() {
		if (instance == null) {
			instance = new NewFeedbackService();
		}
		return instance;
	}

	public void addFeedback(final String ip, final String userAgent, final NewFeedback feedback) {
		String realIp = ip.split(",")[0];

		StringBuilder b = new StringBuilder("Fra IP " + realIp + ", useragent: " + userAgent +"\n");
		
		for (NewFeedbackObject f : feedback.feedback) {
			b.append("\t" + f.id + " : " + f.value + "\n");
		}
		
		if (!feedback.validate()) {
			LOG.warn("Postet feedback som ikke validerte. " + b);
			throw new WebApplicationException(Response.status(BAD_REQUEST).entity("Ikke gyldig feedback!").build());
		}

		LOG.info("Lagrer feedback. " + b);
		for (NewFeedbackObject f : feedback.feedback) {
			feedbackMongoCollection.insert(NewFeedbackObject.toMongoObject(f, realIp, userAgent));
		}
	}

	public NewFeedbackAwesomeWrapper getAllFeedbacks() {
		final List<NewFeedbackDbObject> dbFeedbacks = NewFeedbackDbObject.convertFromMongo(feedbackMongoCollection.find().toArray());
		
		List<EmsSession> sessions = emsService.getConferenceYear().getSessions();
		
		List<NewFeedbackAwesome> feedbacks = newArrayList(transform(sessions, new Function<EmsSession, NewFeedbackAwesome>() {
			@Override
			public NewFeedbackAwesome apply(final EmsSession emsSession) {
				
				List<String> writtenFeedbacks = writtenFeedbacks(dbFeedbacks, emsSession);
				
				ArrayList<Integer> ratings = newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
					@Override
					public boolean apply(NewFeedbackDbObject input) {
						return input.id.contains("rating") && emsSession.getId().startsWith(input.id.replace("-rating", ""));
					}
				}), new Function<NewFeedbackDbObject, Integer>() {
					@Override
					public Integer apply(NewFeedbackDbObject input) {
						return Integer.parseInt(input.value);
					}
				}));
				
				double numberOfRatings = ratings.size();
				double sum = 0;
				for (Integer rating : ratings) {
					sum += rating;
				}
				double avg = -1;
				if(numberOfRatings > 0) {
					avg = sum / numberOfRatings;
				}
				
				return new NewFeedbackAwesome(emsSession.getId(), emsSession.getTitle(), emsSession.getSpeakerNames(), writtenFeedbacks, numberOfRatings, avg);
			}

			private ArrayList<String> writtenFeedbacks(final List<NewFeedbackDbObject> dbFeedbacks, final EmsSession emsSession) {
				return newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
					@Override
					public boolean apply(NewFeedbackDbObject input) {
						return emsSession.getId().startsWith(input.id);
					}
				}), new Function<NewFeedbackDbObject, String>() {
					@Override
					public String apply(NewFeedbackDbObject input) {
						return input.value;
					}
				}));
			}
		}));
		
		return new NewFeedbackAwesomeWrapper(feedbacks);
	}

	
}
