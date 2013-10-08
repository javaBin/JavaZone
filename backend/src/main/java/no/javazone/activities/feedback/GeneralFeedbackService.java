package no.javazone.activities.feedback;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

import java.net.UnknownHostException;
import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import no.javazone.activities.ems.EmsService;
import no.javazone.representations.feedback.AdminGeneralFeedback;
import no.javazone.representations.feedback.GeneralFeedback;
import no.javazone.server.PropertiesLoader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

public class GeneralFeedbackService {

	private static final Logger LOG = LoggerFactory.getLogger(GeneralFeedbackService.class);

	EmsService emsService = EmsService.getInstance();

	public static GeneralFeedbackService instance;
	private DBCollection generalFeedbackMongoCollection;

	public GeneralFeedbackService() {
		MongoClient mongoClient;
		try {
			mongoClient = new MongoClient("localhost", 27017);
			String namespace = PropertiesLoader.getProperty("mongodb.namespace");
			DB db = mongoClient.getDB(namespace);
			generalFeedbackMongoCollection = db.getCollection("generalfeedback");
		} catch (UnknownHostException e) {
			LOG.warn("Kunne ikke starte MongoDB-klient!", e);
		}
	}

	public static GeneralFeedbackService getInstance() {
		if (instance == null) {
			instance = new GeneralFeedbackService();
		}
		return instance;
	}

	public void addGeneralFeedback(final String ip, final String userAgent, final GeneralFeedback feedback) {
		String realIp = ip.split(",")[0];

		String logInfo = String.format("feedback, ip=%s, userAgent=%s", feedback.toString(), realIp, userAgent);

		if (!feedback.validate()) {
			LOG.warn("Postet feedback som ikke validerte. " + logInfo);
			throw new WebApplicationException(Response.status(BAD_REQUEST).entity("Ikke gyldig feedback!").build());
		}

		LOG.info("Lagrer feedback. " + logInfo);
		generalFeedbackMongoCollection.insert(GeneralFeedback.toMongoObject(feedback, realIp, userAgent));
	}

	public List<AdminGeneralFeedback> getAllFeedbacks() {
		return AdminGeneralFeedback.convertFromMongo(generalFeedbackMongoCollection.find().toArray());
	}
}
