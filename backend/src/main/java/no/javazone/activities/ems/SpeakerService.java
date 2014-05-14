package no.javazone.activities.ems;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import net.hamnaberg.json.Link;
import net.hamnaberg.json.util.Optional;
import no.javazone.activities.ems.model.EmsSpeaker;
import no.javazone.activities.ems.model.SpeakerPhotos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class SpeakerService {

	private static final Logger LOG = LoggerFactory.getLogger(SpeakerService.class);

	private final Map<String, EmsSpeaker> cachedSpeakers = new HashMap<String, EmsSpeaker>();

	private final Map<String, SpeakerPhotos> cachedSpeakerPhotos = new HashMap<String, SpeakerPhotos>();

	private final Client jerseyClient;

	private static SpeakerService instance;

	private SpeakerService() {
		jerseyClient = ClientBuilder.newClient();
	}

	public static SpeakerService getInstance() {
		if (instance == null) {
			instance = new SpeakerService();
		}
		return instance;
	}

	public void addToSpeakersCache(final List<EmsSpeaker> speakers) {
		for (EmsSpeaker emsSpeaker : speakers) {
			cachedSpeakers.put(emsSpeaker.getId(), emsSpeaker);
		}
	}

	public long softRefresh() {
		return refresh(false);
	}

	public long forceRefresh() {
		return refresh(true);
	}

	private long refresh(final boolean force) {
		LOG.info("Henter speaker-bilder");
		long start = System.currentTimeMillis();
		int i = 0;
		for (EmsSpeaker speaker : cachedSpeakers.values()) {
			LOG.info(String.format("Cacher speakerbilde for speaker %s av %s", ++i, cachedSpeakers.size()));
			cacheSpeakerImages(speaker, force);
		}
		long bruktTid = System.currentTimeMillis() - start;
		LOG.info("Hentet speaker-bilder på " + bruktTid + "ms.");
		return bruktTid;
	}

	private void cacheSpeakerImages(final EmsSpeaker speaker, final boolean force) {
		try {
			Optional<Link> url = speaker.getEmsPhotoUrl();
			if (url.isSome() && (skalRefresheSpeakerBilde(speaker) || force)) {
				byte[] bilde = jerseyClient.target(url.get().getHref()).request().get(byte[].class);
				cachedSpeakerPhotos.put(speaker.getId(), new SpeakerPhotos(bilde));
			} else {
				LOG.info("--> Skipper henting av bilde for speaker med id " + speaker.getId());
			}
		} catch (Exception e) {
			LOG.warn("Kunne ikke hente bilde for speaker " + speaker.getName(), e);
		}
	}

	private boolean skalRefresheSpeakerBilde(final EmsSpeaker speaker) {
		if (!cachedSpeakerPhotos.containsKey(speaker.getId())) {
			return true;
		} else if (cachedSpeakerPhotos.get(speaker.getId()).erGammelt()) {
			return true;
		} else {
			return false;
		}
	}

	public Response getImageForSpeaker(final String speakerId, final String size, final String gravatarFallbackType) {
		// TODO: usj, for noe søl!!!
		if (cachedSpeakerPhotos.containsKey(speakerId)) {
			SpeakerPhotos photo = cachedSpeakerPhotos.get(speakerId);
			if (Integer.parseInt(size) > SpeakerPhotos.SMALL) {
				return Response.ok(photo.getStortBilde()).build();
			} else {
				return Response.ok(photo.getLiteBilde()).build();
			}
		} else {
			if (cachedSpeakers.containsKey(speakerId)) {
				EmsSpeaker emsSpeaker = cachedSpeakers.get(speakerId);
				String gravatarFallbackUri = emsSpeaker.getGravatarUrl() + "?s=" + size + "&d=" + gravatarFallbackType;
				LOG.warn("Fant ikke bilde som burde vært der. Redirecter til gravatar isteden: " + gravatarFallbackUri);
				return Response.seeOther(URI.create(gravatarFallbackUri)).build();
			} else {
				LOG.error("Fant ikke bilde som burde vært der. Fant heller ikke speaker! Rart. 404-not-found!");
				return Response.status(Status.NOT_FOUND).build();
			}
		}
	}
}
