package no.javazone.activities.video.model;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeVideo {

	@JsonProperty
	public Data data;

	@Override
	public String toString() {
		return "YouTubeVideo [data=" + data + "]";
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public class Data {

		@JsonProperty
		public String title;

		@JsonProperty
		public long viewCount;

		@JsonProperty
		public long ratingCount;

		@JsonProperty
		public long commentCount;

		@JsonProperty
		public long likeCount;

		@JsonProperty
		public double rating;

		@Override
		public String toString() {
			return "Data [title=" + title + ", viewCount=" + viewCount + ", ratingCount=" + ratingCount + ", commentCount=" + commentCount
					+ ", likeCount=" + likeCount + ", rating=" + rating + "]  ";
		}

	}

	public long getViews() {
		return data.viewCount;
	}

	public long getInteractions() {
		return data.ratingCount + data.commentCount + data.likeCount;
	}
}
