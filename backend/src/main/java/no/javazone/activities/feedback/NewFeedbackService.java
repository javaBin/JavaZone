package no.javazone.activities.feedback;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

import no.javazone.representations.feedback.NewFeedbackOut;

import no.javazone.representations.feedback.NewFeedbackObject;
import no.javazone.representations.feedback.NewFeedback;

import java.net.UnknownHostException;
import java.util.List;

import javax.swing.text.StyledEditorKit.ForegroundAction;
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

	public NewFeedbackOut getAllFeedbacks() {
		return NewFeedbackOut.convertFromMongo(feedbackMongoCollection.find().toArray());
	}
}
