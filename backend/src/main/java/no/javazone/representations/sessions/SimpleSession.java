package no.javazone.representations.sessions;

import java.util.ArrayList;
import java.util.List;

import no.javazone.activities.ems.model.EmsSession;
import no.javazone.representations.Link;
import no.javazone.server.PropertiesLoader;

import org.codehaus.jackson.annotate.JsonProperty;

import com.google.common.base.Function;

public class SimpleSession {

	@JsonProperty("title")
	private final String title;
	@JsonProperty("format")
	private final String format;
	@JsonProperty("level")
	private final String level;
	@JsonProperty("lang")
	private final String lang;
	@JsonProperty("room")
	private final String room;
	@JsonProperty("start")
	private final String start;
	@JsonProperty("stop")
	private final String stop;
	@JsonProperty("keywords")
	private final List<String> keywords;
	@JsonProperty("speakers")
	private final List<SimpleSpeaker> speakers;
	@JsonProperty("links")
	private final List<Link> links;

	public SimpleSession(final String title, final String format, final String level, final String lang, final String room,
			final String start, final String stop, final List<String> keywords, final List<SimpleSpeaker> speakers, final List<Link> links) {
		this.title = title;
		this.format = format;
		this.level = level;
		this.lang = lang;
		this.room = room;
		this.start = start;
		this.stop = stop;
		this.keywords = keywords;
		this.speakers = speakers;
		this.links = links;
	}

	public static Function<EmsSession, SimpleSession> emsSessionToSimpleSession() {
		return new Function<EmsSession, SimpleSession>() {
			@Override
			public SimpleSession apply(final EmsSession emsSession) {
				return new SimpleSession(emsSession.getTitle(), emsSession.getFormat(), emsSession.getLevel(), emsSession.getLang(),
						emsSession.getRoom(), emsSession.getStart(), emsSession.getStop(), emsSession.getKeywords(),
						SimpleSpeaker.createSpeakers(emsSession.getSpeakerDetails()), createLinks(emsSession));
			}

			private List<Link> createLinks(final EmsSession emsSession) {
				List<Link> links = new ArrayList<Link>();
				links.add(new Link("details", PropertiesLoader.getProperty("server.proxy") + "/sessions/" + emsSession.getId()));
				if (emsSession.feedbackEnabled()) {
					links.add(new Link("feedback", PropertiesLoader.getProperty("server.proxy") + "/feedback/" + emsSession.getId()));
				}
				if (emsSession.getVideoLink().isSome()) {
					links.add(new Link("video", emsSession.getVideoLink().get().getHref().toString()));
				}
				return links;
			}
		};
	}

}
