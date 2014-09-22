package no.javazone.activities.feedback;

import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import org.codehaus.jackson.annotate.JsonProperty;
import no.javazone.activities.feedback.PaperFeedbackService.RoomStats;
import no.javazone.representations.feedback.NewFeedbackAwesome;
import no.javazone.activities.feedback.VimeoStatsSingle.VimeoStat;
import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import no.javazone.activities.SecretService;
import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.activities.feedback.PaperFeedbackService.PaperFeedback;
import no.javazone.activities.feedback.model.NewFeedbackDbObject;
import no.javazone.activities.feedback.model.Rating;
import no.javazone.representations.feedback.*;
import no.javazone.server.PropertiesLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

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
		
		PaperFeedbackService paperFeedbackService = new PaperFeedbackService();
		
		List<NewFeedbackAwesome> feedbacks = allFeedbacks(dbFeedbacks, paperFeedbackService);
		
		
		List<FeedbackWithId> conferenceFeedback = newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
			@Override
			public boolean apply(NewFeedbackDbObject input) {
				return input.id.equals("conference");
			}
		}), feedbackToValue()));
		
		List<FeedbackWithId> emails = newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
			@Override
			public boolean apply(NewFeedbackDbObject input) {
				return input.id.equals("email");
			}
		}), feedbackToValue()));
		
		Rating rating = conferenceRatingInTotal(dbFeedbacks);
		PaperFeedback paperFeedbackAllTalks = paperFeedbackService.getFeedbackAllTalks();
		
		return new NewFeedbackAwesomeWrapper(emails, conferenceFeedback, rating.red, rating.yellow, rating.green, rating.avg, 
				feedbacks, paperFeedbackAllTalks.red, paperFeedbackAllTalks.yellow, paperFeedbackAllTalks.green);
	}

	private List<NewFeedbackAwesome> allFeedbacks(final List<NewFeedbackDbObject> dbFeedbacks, PaperFeedbackService paperFeedbackService) {
		List<EmsSession> sessions = emsSessionsWithoutWorkshops();
		
		List<NewFeedbackAwesome> feedbacks = newArrayList(transform(sessions, emsSessionToFeedback(dbFeedbacks, paperFeedbackService)));
		return feedbacks;
	}

	private List<EmsSession> emsSessionsWithoutWorkshops() {
		List<EmsSession> sessions = newArrayList(filter(emsService.getConferenceYear().getSessions(), new Predicate<EmsSession>() {
			@Override
			public boolean apply(EmsSession input) {
				return !input.getFormat().contains("workshop");
			}
		}));
		return sessions;
	}

	private Function<EmsSession, NewFeedbackAwesome> emsSessionToFeedback(final List<NewFeedbackDbObject> dbFeedbacks, final PaperFeedbackService paperFeedbackService) {
		return new Function<EmsSession, NewFeedbackAwesome>() {
			@Override
			public NewFeedbackAwesome apply(final EmsSession emsSession) {
				
				List<FeedbackWithId> writtenFeedbacks = writtenFeedbacks(dbFeedbacks, emsSession);
				
				Rating rating = Rating.from(ratings(dbFeedbacks, emsSession));
				
				int red = 0;
				int green = 0;
				int yellow = 0;
				Optional<PaperFeedback> paperFeedback = paperFeedbackService.getFeedback(emsSession);
				if(paperFeedback.isPresent()) {
					red = paperFeedback.get().red;
					green = paperFeedback.get().green;
					yellow = paperFeedback.get().yellow;
				}
				
				String secret = SecretService.getSecretForValue(emsSession.getId());
				
				VimeoStat vimeoStats = new VimeoStatsSingle().getStatsForVideoId(emsSession.getVideoId().get());
				
				return new NewFeedbackAwesome(emsSession.getId(), secret, emsSession.getTitle(), emsSession.getSpeakerNames(), emsSession.getSpeakerEmails(), writtenFeedbacks, 
						rating.red, rating.yellow, rating.green, rating.avg, 
						red, green, yellow, vimeoStats, emsSession.getVideoLink().get().getHref().toString());
			}

			private ArrayList<Integer> ratings(final List<NewFeedbackDbObject> dbFeedbacks, final EmsSession emsSession) {
				return newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
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
			}

			private ArrayList<FeedbackWithId> writtenFeedbacks(final List<NewFeedbackDbObject> dbFeedbacks, final EmsSession emsSession) {
				return newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
					@Override
					public boolean apply(NewFeedbackDbObject input) {
						return emsSession.getId().startsWith(input.id);
					}
				}), feedbackToValue()));
			}

			
		};
	}

	private Function<NewFeedbackDbObject, FeedbackWithId> feedbackToValue() {
		return new Function<NewFeedbackDbObject, FeedbackWithId>() {
			@Override
			public FeedbackWithId apply(NewFeedbackDbObject input) {
				return new FeedbackWithId(input.mongoId, input.value);
			}
		};
	}
	
	public class FeedbackWithId {

		@JsonProperty
		public String mongoId;
		@JsonProperty
		public String value;

		public FeedbackWithId(String mongoId, String value) {
			this.mongoId = mongoId;
			this.value = value;
		}
		
	}
	
	private Rating conferenceRatingInTotal(final List<NewFeedbackDbObject> dbFeedbacks) {
		ArrayList<Integer> allRatings = newArrayList(transform(filter(dbFeedbacks, new Predicate<NewFeedbackDbObject>() {
			@Override
			public boolean apply(NewFeedbackDbObject input) {
				return input.id.contains("rating");
			}
		}), new Function<NewFeedbackDbObject, Integer>() {
			@Override
			public Integer apply(NewFeedbackDbObject input) {
				return Integer.parseInt(input.value);
			}
		}));
		Rating rating = Rating.from(allRatings);
		return rating;
	}

	public NewFeedbackAwesomeWrapperSingle getSingleFeedback(String id, String secret) {
		if(!SecretService.checkSecret(id, secret)) {
			throw new WebApplicationException(Status.FORBIDDEN);
		}
		EmsSession emsSession = emsService.getSession(id);
		if(emsSession == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}
		
		// TODO: ganske ineffektivt, but whatever... :P
		final List<NewFeedbackDbObject> dbFeedbacks = NewFeedbackDbObject.convertFromMongo(feedbackMongoCollection.find().toArray());
		PaperFeedbackService paperFeedbackService = new PaperFeedbackService();
		
		Rating rating = conferenceRatingInTotal(dbFeedbacks);
		PaperFeedback paperFeedbackAllTalks = paperFeedbackService.getFeedbackAllTalks();
		
		List<Double> paperHistogramData = paperFeedbackService.getHistogramData();
		List<Double> webHistogramData = calculateWebRatingsHistogram(dbFeedbacks, paperFeedbackService);
		
		RoomStats roomStats = paperFeedbackService.getRoomStats(emsSessionsWithoutWorkshops(), emsSession);
		
		NewFeedbackAwesome feedback = emsSessionToFeedback(dbFeedbacks, paperFeedbackService).apply(emsSession);
		
		return new NewFeedbackAwesomeWrapperSingle(rating.red, rating.yellow, rating.green, rating.avg, 
				feedback, paperFeedbackAllTalks.red, paperFeedbackAllTalks.yellow, paperFeedbackAllTalks.green, 
				paperHistogramData, webHistogramData, roomStats);
	}

	private List<Double> calculateWebRatingsHistogram(final List<NewFeedbackDbObject> dbFeedbacks, PaperFeedbackService paperFeedbackService) {
		// TODO: dette er også en øøøøøgly hack. jeez, denne koden begynner å bli crappy :P
		List<NewFeedbackAwesome> feedbacks = allFeedbacks(dbFeedbacks, paperFeedbackService);
		List<Double> webHistogramData = newArrayList(transform(filter(feedbacks, new Predicate<NewFeedbackAwesome>() {
			@Override
			public boolean apply(NewFeedbackAwesome input) {
				return input.avgWeb > 0;
			}
		}), new Function<NewFeedbackAwesome, Double>() {
			@Override
			public Double apply(NewFeedbackAwesome input) {
				return Math.floor(input.avgWeb * 10) / 10;
			}
		}));
		return webHistogramData;
	}

	public void deleteFeedback(String mongoID) {
		LOG.info(String.format("Forsøker å slette feedback %s", mongoID));

		DBCursor cursor = feedbackMongoCollection.find();
		for (DBObject dbObject : cursor) {
			if (dbObject.get("_id").toString().equals(mongoID)) {
				feedbackMongoCollection.remove(dbObject);
				LOG.info("Slettet: " + dbObject.toString());
				return;
			}
		}
		LOG.warn("Fant ikke mongoobjekt for sletting med id " + mongoID);
	}

	
}
