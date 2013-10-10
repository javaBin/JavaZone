package no.javazone.activities.feedback;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import net.hamnaberg.json.util.Optional;
import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.activities.ems.model.EmsSpeaker;
import no.javazone.activities.feedback.AnalyticsStats.AnalyticsStat;
import no.javazone.activities.feedback.VimeoStatsSingle.VimeoStat;
import no.javazone.representations.feedback.AdminFeedback;
import no.javazone.representations.feedback.Feedback;
import no.javazone.representations.feedback.FeedbackSummary;
import no.javazone.representations.feedback.FeedbackSummaryForSpeakers;
import no.javazone.representations.sessions.Session;
import no.javazone.server.PropertiesLoader;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.AggregationOutput;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class SpeakerFeedbackService {

	private static final Logger LOG = LoggerFactory.getLogger(SpeakerFeedbackService.class);

	EmsService emsService = EmsService.getInstance();

	public static SpeakerFeedbackService instance;
	private DBCollection talkFeedbackMongoCollection;
	private DBCollection feedbacksecretsMongoCollection;

	private AnalyticsStats analyticsStats;

	private static final String FRONTEND_URL = PropertiesLoader.getProperty("server.proxy").replace("/api", "");;

	public SpeakerFeedbackService() {
		MongoClient mongoClient;
		try {
			mongoClient = new MongoClient("localhost", 27017);
			String namespace = PropertiesLoader.getProperty("mongodb.namespace");
			DB db = mongoClient.getDB(namespace);
			talkFeedbackMongoCollection = db.getCollection("feedback");
			feedbacksecretsMongoCollection = db.getCollection("feedbacksecrets");
			analyticsStats = new AnalyticsStats();
		} catch (UnknownHostException e) {
			LOG.warn("Kunne ikke starte MongoDB-klient!", e);
		}
	}

	public List<Feedback> getFeedbacksForTalk(final String talkId) {
		DBCursor cursor = talkFeedbackMongoCollection.find(new BasicDBObject("talkId", talkId));

		try {
			System.out.println("Fant " + cursor.size() + " feedbacks som matcher talkid " + talkId);
			return Feedback.convertFromMongo(cursor.toArray());
		} finally {
			cursor.close();
		}
	}

	public String getSummaryForTalk(final String talkId) {
		// db.feedback.aggregate( {"$match": {"talkId": "123"}},
		// { "$group": { _id: "$talkId", number: { $sum:1}, average: { $avg:
		// "$rating"}}})

		DBObject match = new BasicDBObject("$match", new BasicDBObject("talkId", talkId));

		DBObject groupFields = new BasicDBObject("_id", "$talkId");
		groupFields.put("number_of_feedbacks", new BasicDBObject("$sum", 1));
		groupFields.put("average_rating", new BasicDBObject("$avg", "$rating"));
		DBObject group = new BasicDBObject("$group", groupFields);

		AggregationOutput output = talkFeedbackMongoCollection.aggregate(match, group);

		Iterable<DBObject> results = output.results();
		System.out.println(results);

		return results.toString();
	}

	@SuppressWarnings("unchecked")
	public Map<String, List<Feedback>> getAllFeedbacks() {
		List<String> talkIds = talkFeedbackMongoCollection.distinct("talkId");
		Map<String, List<Feedback>> res = new HashMap<String, List<Feedback>>();
		for (String talkId : talkIds) {
			res.put(talkId, getFeedbacksForTalk(talkId));
		}
		return res;
	}

	public void addFeedbackForTalk(final String talkId, final String ip, final String userAgent, final Feedback feedback) {
		String realIp = ip.split(",")[0];
		String logInfo = String.format("talkId=%s, rating=%s, comment=%s, ip=%s, userAgent=%s", talkId, feedback.rating, feedback.comment,
				realIp, userAgent);

		if (!feedback.validate()) {
			LOG.warn("Postet feedback som ikke validerte. " + logInfo);
			throw new WebApplicationException(Response.status(BAD_REQUEST).entity("Ikke gyldig feedback!").build());
		}

		EmsSession session = emsService.getSession(talkId);
		if (session == null || !session.feedbackEnabled()) {
			LOG.warn("Forsøkte å sende inn feedback for talk som ikke enda er åpnet for feedback." + logInfo);
			throw new WebApplicationException(Response.status(BAD_REQUEST).entity("Feedback for talk ikke åpnet!").build());
		}

		LOG.info("Lagrer feedback. " + logInfo);
		talkFeedbackMongoCollection.insert(Feedback.toMongoObject(feedback, session.getId(), realIp, userAgent));
	}

	public static SpeakerFeedbackService getInstance() {
		if (instance == null) {
			instance = new SpeakerFeedbackService();
		}
		return instance;
	}

	public FeedbackSummary getFeedbackSummaryForTalk(final String talkId) {
		DBCursor cursor = talkFeedbackMongoCollection.find(new BasicDBObject("talkId", talkId));

		// TODO: gjøre noe av dette med mongo direkte? :)
		int antallRating = 0;
		int totalRating = 0;
		List<String> comments = new ArrayList<String>();
		List<AdminFeedback> details = new ArrayList<AdminFeedback>();
		try {
			while (cursor.hasNext()) {
				DBObject o = cursor.next();
				if (o.containsField("rating") && o.get("rating") != null) {
					int rating = Integer.parseInt(o.get("rating").toString());
					antallRating++;
					totalRating += rating;
				}
				if (o.containsField("comment") && o.get("comment") != null) {
					comments.add(o.get("comment").toString());
				}

				details.add(AdminFeedback.fromDbObject(o));
			}
			double gjennomsnitt = antallRating > 0 ? (double) totalRating / (double) antallRating : 0;

			return new FeedbackSummary(antallRating, gjennomsnitt, comments, details);
		} finally {
			cursor.close();
		}
	}

	public boolean statusCheck() {
		try {
			talkFeedbackMongoCollection.count();
			return true;
		} catch (Exception e) {
			LOG.warn("Feil ved ping av mongo", e);
			return false;
		}
	}

	public FeedbackSummaryForSpeakers getSpeakersOwnFeedbackSummary(final String talkId, final String secret) {
		EmsSession emsSession = emsService.getSession(talkId);
		String realSecret = getOrGenerateSecretForTalk(emsSession.getId());
		if (realSecret.equals(secret)) {
			FeedbackSummary f = getFeedbackSummaryForTalk(emsSession.getId());
			VimeoStat videoStats = getVimeoStatsForTalk(emsSession);
			AnalyticsStat analyticsStat = getAnalyticsStatsForTalk(emsSession.getId());
			String pageViews = analyticsStat == null ? "unknown" : analyticsStat.pageviews;
			double avgRatingForAllTalks = getAvgRatingForAllTalks();
			Session session = Session.createSession(emsSession);
			return new FeedbackSummaryForSpeakers(session, f.numRatings, f.avgRating, f.comments, avgRatingForAllTalks, pageViews,
					videoStats);
		} else {
			throw new WebApplicationException(Status.FORBIDDEN);
		}
	}

	private AnalyticsStat getAnalyticsStatsForTalk(final String id) {
		return analyticsStats.getStatsForTalkId(id.substring(0, 8));
	}

	private VimeoStat getVimeoStatsForTalk(final EmsSession session) {
		Optional<Integer> videoIdOpt = session.getVideoId();
		if (videoIdOpt.isSome()) {
			Integer videoId = videoIdOpt.get();
			System.out.println("video: " + videoId);
			return new VimeoStatsSingle().getStatsForVideoId(videoId);
		} else {
			return null;
		}
	}

	public String getFeedbackUrlsForAllSessions() {
		StringBuilder b = new StringBuilder();
		List<EmsSession> sessions = emsService.getConferenceYear().getSessions();
		for (EmsSession emsSession : sessions) {
			String talkId = emsSession.getId();
			String secret = getOrGenerateSecretForTalk(talkId);
			List<EmsSpeaker> speakers = emsSession.getSpeakerDetails();
			for (EmsSpeaker emsSpeaker : speakers) {
				String name = emsSpeaker.getName();
				String email = emsSpeaker.getEmail();
				String url = FRONTEND_URL + String.format("/talkfeedback.html?id=%s&secret=%s", talkId, secret);
				Object[] array = { name, email, url };
				b.append(StringUtils.join(array, ",") + "\n");
			}
		}
		return b.toString();
	}

	private double getAvgRatingForAllTalks() {
		DBObject groupFields = new BasicDBObject("_id", "$talkId");
		groupFields.put("average_rating", new BasicDBObject("$avg", "$rating"));
		DBObject group = new BasicDBObject("$group", groupFields);

		AggregationOutput output = talkFeedbackMongoCollection.aggregate(group);
		Iterable<DBObject> results = output.results();
		double total = 0;
		double i = 0;
		for (DBObject dbObject : results) {
			total += (Double) dbObject.get("average_rating");
			i++;
		}
		return total / i;
	}

	private String getOrGenerateSecretForTalk(final String talkId) {
		DBCursor cursor = null;
		try {
			cursor = feedbacksecretsMongoCollection.find(new BasicDBObject("talkId", talkId));
			List<DBObject> dbObjects = cursor.toArray();
			if (dbObjects.size() == 0) {
				String secret = UUID.randomUUID().toString();
				feedbacksecretsMongoCollection.insert(new BasicDBObject().append("talkId", talkId).append("secret", secret));
				return secret;
			} else {
				return (String) dbObjects.get(0).get("secret");
			}
		} finally {
			cursor.close();
		}
	}
}
