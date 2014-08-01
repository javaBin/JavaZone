package no.javazone.activities.ems.model;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.hamnaberg.json.Item;
import net.hamnaberg.json.Link;
import net.hamnaberg.json.util.Optional;
import no.javazone.activities.ems.ItemHelper;
import no.javazone.server.PropertiesLoader;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.common.base.Function;

public class EmsSession {

	private static final Logger LOG = LoggerFactory.getLogger(EmsSession.class);

	private final String id;
	private final String slug;
	private final String title;
	private final String summary;
	private final String outline;
	private final String body;
	private final String format;
	private final String audience;
	private final String level;
	private final String lang;
	private final String room;
	private final String start;
	private final LocalDateTime startDateTime;
	private final String stop;
	private final List<String> keywords;
	private final List<String> speakerNames;
	private final Optional<Link> speakerLink;
	private List<EmsSpeaker> speakerDetails;
	private final Optional<Link> videoLink;

	private static final Pattern NUMBER = Pattern.compile("[0-9]+");


	public EmsSession(final String id, final String slug, final String title, final String summary, final String outline, final String body,
			final String format, final String audience, final String level, final String lang, final String room, final String start,
			final LocalDateTime startDateTime, final String stop, final List<String> keywords, final List<String> speakerNames,
			final Optional<Link> speakerLink, final Optional<Link> videoLink) {
		this.id = id;
		this.slug = slug;
		this.title = title;
		this.summary = summary;
		this.outline = outline;
		this.body = body;
		this.format = format;
		this.audience = audience;
		this.level = level;
		this.lang = lang;
		this.room = room;
		this.start = start;
		this.startDateTime = startDateTime;
		this.stop = stop;
		this.keywords = keywords;
		this.speakerNames = speakerNames;
		this.speakerLink = speakerLink;
		this.videoLink = videoLink;
	}

	public String getId() {
		return id;
	}
	
	public String getSlug() {
		return slug;
	}

	public String getTitle() {
		return title;
	}

	public String getSummary() {
		return summary;
	}

	public String getOutline() {
		return outline;
	}

	public String getBody() {
		return body;
	}

	public String getFormat() {
		return format;
	}

	public String getAudience() {
		return audience;
	}

	public String getLevel() {
		return level;
	}

	public String getLang() {
		return lang;
	}

	public String getRoom() {
		return room;
	}

	public String getStart() {
		return start;
	}

	public String getStop() {
		return stop;
	}

	public List<String> getKeywords() {
		return keywords;
	}

	public List<String> getSpeakerNames() {
		return speakerNames;
	}

	public Optional<Link> getSpeakerLink() {
		return speakerLink;
	}

	public Optional<Link> getVideoLink() {
		return videoLink;
	}

	public Optional<Integer> getVideoId() {
		if (getVideoLink().isSome()) {
			Matcher matcher = NUMBER.matcher(getVideoLink().get().getHref().toString());
			if (matcher.find()) {
				return Optional.some(Integer.parseInt(matcher.group()));
			}
		}
		return Optional.none();
	}

	public List<EmsSpeaker> getSpeakerDetails() {
		return speakerDetails;
	}

	@Override
	public String toString() {
		return "Session [title=" + title + "]";
	}

	public static Function<Item, EmsSession> collectionItemToSession() {
		return new Function<Item, EmsSession>() {
			@Override
			public EmsSession apply(final Item item) {
				String id = ItemHelper.generateId(item);

				String slug = ItemHelper.getStringValue(item, "slug");
				
				String title = ItemHelper.getStringValue(item, "title");
				String summary = ItemHelper.getStringValue(item, "summary");
				String outline = ItemHelper.getStringValue(item, "outline");
				String body = ItemHelper.getStringValue(item, "body");
				String format = ItemHelper.getStringValue(item, "format");
				String audience = ItemHelper.getStringValue(item, "audience");
				String level = ItemHelper.getStringValue(item, "level");
				String lang = ItemHelper.getStringValue(item, "lang");

				List<String> keywords = ItemHelper.getArrayValue(item, "keywords");
				List<String> speakerNames = extractSpeakerNames(item);
				String room = extractRoom(item);

				// TODO: refaktorere, detta var støgt :P
				String start = null;
				String stop = null;
				String slotString = extractSlotString(item);
				if (slotString != null) {
					String[] strings = slotString.split("\\+");
					if (strings.length == 2) {
						start = strings[0];
						stop = strings[1];
					}
				}

				LocalDateTime startDateTime = null;
				try {
					startDateTime = DateTime.parse(start).toLocalDateTime();
				} catch (Exception e) {
					LOG.warn("Kunne ikke parse start-tidspunkt for talk med id=" + id + ". start=" + start);
				}

				Optional<Link> speakerLink = ItemHelper.getLink(item, "speaker collection");

				Optional<Link> videoLink = ItemHelper.getLink(item, "alternate video");

				return new EmsSession(id, slug, title, summary, outline, body, format, audience, level, lang, room, start, startDateTime, stop,
						keywords, speakerNames, speakerLink, videoLink);
			}

			private String extractSlotString(final Item item) {
				Optional<Link> slotLink = ItemHelper.getLink(item, "slot item");
				if (slotLink.isNone()) {
					return null;
				}
				Optional<String> slotPrompt = slotLink.get().getPrompt();
				if (slotPrompt.isNone()) {
					return null;
				}
				return slotPrompt.get();
			}

			private String extractRoom(final Item item) {
				Optional<Link> roomLink = ItemHelper.getLink(item, "room item");
				if (roomLink.isNone()) {
					return "";
				}
				Optional<String> roomPrompt = roomLink.get().getPrompt();
				if (roomPrompt.isNone()) {
					return "";
				}
				return roomPrompt.get();
			}

			private List<String> extractSpeakerNames(final Item item) {
				List<Link> speakerLinks = ItemHelper.getLinks(item, "speaker item");
				return newArrayList(transform(speakerLinks, new Function<Link, String>() {
					@Override
					public String apply(final Link link) {
						Optional<String> prompt = link.getPrompt();
						if (prompt.isSome()) {
							return prompt.get();
						} else {
							return "";
						}
					}
				}));
			}

		};
	}

	public void addDetailedSpeakerInfo(final List<EmsSpeaker> speakerDetails) {
		this.speakerDetails = speakerDetails;
	}

	public boolean feedbackEnabled() {
		int openFeedbackMinutesBeforeTalkStart = Integer.parseInt(PropertiesLoader.getProperty("feedback.minutes.before.talk"));
		int tidssoneoffsetServer = Integer.parseInt(PropertiesLoader.getProperty("server.tidssoneoffset.minutes"));
		LocalDateTime åpneTalksSomStarterFør = LocalDateTime
				.now()
				.plusMinutes(tidssoneoffsetServer)
				.plusMinutes(openFeedbackMinutesBeforeTalkStart);
		if (startDateTime == null) {
			return true;
		} else {
			// Tidssone-hack...
			LocalDateTime talkstartNorskTid = startDateTime.plusHours(2);
			boolean åpneForFeedback = talkstartNorskTid.isBefore(åpneTalksSomStarterFør);

//			System.out.println(String.format("Talk starter %s. Vi åpner talks som starter før %s. Åpne denne=%s", talkstartNorskTid,
//					åpneTalksSomStarterFør, åpneForFeedback));
			return åpneForFeedback;
		}
	}
}
