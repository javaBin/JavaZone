package no.javazone.representations.sessions;

import static com.google.common.collect.Lists.newArrayList;

import java.util.List;

import no.javazone.activities.ems.model.EmsSession;
import no.javazone.activities.feedback.SpeakerFeedbackService;
import no.javazone.representations.Link;
import no.javazone.representations.feedback.FeedbackSummary;
import no.javazone.server.PropertiesLoader;

import org.codehaus.jackson.annotate.JsonProperty;

import com.google.common.base.Function;

public class AdminSimpleSession {

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
	@JsonProperty("feedback")
	private final FeedbackSummary feedback;
	@JsonProperty("links")
	private final List<Link> links;

	public AdminSimpleSession(final String title, final String format, final String level, final String lang, final String room,
			final String start, final String stop, final List<String> keywords, final List<SimpleSpeaker> speakers,
			final FeedbackSummary feedback, final List<Link> links) {
		this.title = title;
		this.format = format;
		this.level = level;
		this.lang = lang;
		this.room = room;
		this.start = start;
		this.stop = stop;
		this.keywords = keywords;
		this.speakers = speakers;
		this.feedback = feedback;
		this.links = links;
	}

	public static Function<EmsSession, AdminSimpleSession> emsSessionToAdminSimpleSession() {
		return new Function<EmsSession, AdminSimpleSession>() {
			@Override
			public AdminSimpleSession apply(final EmsSession emsSession) {

				// TODO: burde gjøres ute i servicen isteden...
				FeedbackSummary feedback = SpeakerFeedbackService.getInstance().getFeedbackSummaryForTalk(emsSession.getId());

				return new AdminSimpleSession(emsSession.getTitle(), emsSession.getFormat(), emsSession.getLevel(), emsSession.getLang(),
						emsSession.getRoom(), emsSession.getStart(), emsSession.getStop(), emsSession.getKeywords(),
						SimpleSpeaker.createSpeakers(emsSession.getSpeakerDetails()), feedback, createLinks(emsSession));
			}

			private List<Link> createLinks(final EmsSession emsSession) {
				Link detailsLink = new Link("details", PropertiesLoader.getProperty("server.proxy") + "/admin/sessions/"
						+ emsSession.getId());
				Link feedbackLink = new Link("feedback", PropertiesLoader.getProperty("server.proxy") + "/admin/feedback/"
						+ emsSession.getId());
				return newArrayList(detailsLink, feedbackLink);
			}
		};
	}

}
