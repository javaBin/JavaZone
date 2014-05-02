package no.javazone.representations.video;

import org.codehaus.jackson.annotate.JsonProperty;

public class Video {

	@JsonProperty
	public long views;

	@JsonProperty
	public long interactions;

	public Video(final long views, final long interactions) {
		this.views = views;
		this.interactions = interactions;
	}
}
