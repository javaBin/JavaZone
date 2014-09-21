package no.javazone.activities.ems;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import no.javazone.server.PropertiesLoader;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import net.hamnaberg.json.Collection;
import net.hamnaberg.json.Link;
import net.hamnaberg.json.parser.CollectionParser;
import net.hamnaberg.json.util.Optional;
import no.javazone.activities.ems.model.ConferenceYear;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.activities.ems.model.EmsSpeaker;
import org.apache.commons.lang3.time.StopWatch;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class EmsService {

	private static final Logger LOG = LoggerFactory.getLogger(EmsService.class);

	// Prod 2014
	private static final String SESSION_LINK_2014 = "http://www.javazone.no/ems/server/events/9f40063a-5f20-4d7b-b1e8-ed0c6cc18a5f/sessions";
	
	// Test 2014
	//private static final String SESSION_LINK_2014 = "http://test.javazone.no/ems/server/events/9f40063a-5f20-4d7b-b1e8-ed0c6cc18a5f/sessions";

	private static EmsService instance;

	private final Client jerseyClient;

	private final SpeakerService speakerService = SpeakerService.getInstance();

	private ConferenceYear conferenceYear = null;

	private EmsService() {
		ClientConfig config = new DefaultClientConfig();
		jerseyClient = Client.create(config);
	}

	public long refresh() {
		try {
			LOG.info("Starter innlasting av sessions for 2013 fra EMS");
			StopWatch s = new StopWatch();
			s.start();

			InputStream stream = jerseyClient.resource(SESSION_LINK_2014).get(InputStream.class);
			Collection collection = new CollectionParser().parse(stream);

			ArrayList<EmsSession> sessions = newArrayList(transform(collection.getItems(), EmsSession.collectionItemToSession()));

			LOG.info("Henter speakerinfo for sessions");
			int i = 0;
			// Litt hackish :P
			for (EmsSession emsSession : sessions) {
				try {
					LOG.info(String.format("Henter speakerinfo for session %s av %s", ++i, sessions.size()));
					List<EmsSpeaker> speakersForSession = getSpeakersForSession(emsSession);
					emsSession.addDetailedSpeakerInfo(speakersForSession);
				} catch (Exception e) {
					emsSession.addDetailedSpeakerInfo(new ArrayList<EmsSpeaker>());
					LOG.warn("Feilet under uthenting av speakerinfo for en session. Går videre...", e);
				}
			}
			LOG.info("Ferdig med å hente speakerinfo for sessions");

			conferenceYear = new ConferenceYear(sessions, new DateTime());

			long bruktTid = s.getTime();
			LOG.info("Lastet session for 2013 fra EMS på {} ms.", bruktTid);
			return bruktTid;

		} catch (IOException e) {
			LOG.warn("Kunne ikke refreshe sessions fra EMS – fikk feil...", e);
			Response response = Response
					.status(Status.SERVICE_UNAVAILABLE)
					.entity(String.format("%s: Refresh av sessions fra EMS feilet\n", new DateTime().toString()))
					.build();
			throw new WebApplicationException(response);
		}
	}

	public ConferenceYear getConferenceYear() {
		if (conferenceYear == null) {
			throw new WebApplicationException(Status.SERVICE_UNAVAILABLE);
		}
		return conferenceYear;
	}

	public static EmsService getInstance() {
		if (instance == null) {
			instance = new EmsService();
		}
		return instance;
	}

	public EmsSession getSession(final String id) {
		for (EmsSession session : conferenceYear.getSessions()) {
			if (session.getId().startsWith(id)) {
				return session;
			}
		}
		return null;
	}

	public List<EmsSpeaker> getSpeakersForSession(final EmsSession emsSession) {
		try {
			Optional<Link> speakerLinkOptional = emsSession.getSpeakerLink();
			if (speakerLinkOptional.isSome()) {
				Link speakerLink = speakerLinkOptional.get();

				InputStream stream = jerseyClient
						.resource(speakerLink.getHref())
						.header("Authorization", "Basic " + PropertiesLoader.getProperty("ems.basicauth"))
						.get(InputStream.class);
				Collection collection = new CollectionParser().parse(stream);
				List<EmsSpeaker> speakers = newArrayList(transform(collection.getItems(), EmsSpeaker.collectionItemToSpeaker()));

				speakerService.addToSpeakersCache(speakers);

				return speakers;
			} else {
				return newArrayList();
			}
		} catch (IOException e) {
			LOG.warn("Kunne ikke hente speakers for session " + emsSession.getTitle(), e);
			throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
		}
	}

}
