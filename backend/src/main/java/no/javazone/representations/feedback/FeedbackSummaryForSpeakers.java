package no.javazone.representations.feedback;

import java.util.List;

import no.javazone.activities.feedback.SpeakerFeedbackService.TotalTalkRatings;
import no.javazone.activities.feedback.VimeoStatsSingle.VimeoStat;
import no.javazone.representations.sessions.Session;

import org.codehaus.jackson.annotate.JsonProperty;

public class FeedbackSummaryForSpeakers {

	@JsonProperty
	private final Session session;
	@JsonProperty
	private final int numRatings;
	@JsonProperty
	private final double avgRating;
	@JsonProperty
	private final TotalTalkRatings totalTalkRatings;
	@JsonProperty
	private final List<String> comments;
	@JsonProperty
	private final String pageViews;
	@JsonProperty
	private final VimeoStat videoStats;

	public FeedbackSummaryForSpeakers(final Session session, final int numRatings, final double avgRating, final List<String> comments,
			final TotalTalkRatings totalTalkRatings, final String pageViews, final VimeoStat videoStats) {
		this.session = session;
		this.numRatings = numRatings;
		this.avgRating = avgRating;
		this.comments = comments;
		this.totalTalkRatings = totalTalkRatings;
		this.pageViews = pageViews;
		this.videoStats = videoStats;
	}

}
