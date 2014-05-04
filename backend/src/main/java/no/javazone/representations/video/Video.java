package no.javazone.representations.video;

import org.codehaus.jackson.annotate.JsonProperty;

public class Video {

	@JsonProperty
	public long youtubeViews;

	@JsonProperty
	public long youtubeInteractions;

	@JsonProperty
	private final int webpageViews;

	public Video(final long youtubeViews, final long youtubeInteractions, final int webpageViews) {
		this.youtubeViews = youtubeViews;
		this.youtubeInteractions = youtubeInteractions;
		this.webpageViews = webpageViews;
	}
}
