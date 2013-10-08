package no.javazone.representations.wordpress;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Bloggpost {

	@JsonProperty
	private String date;

	@JsonProperty
	private String title;

	@JsonProperty
	private String content;

	@JsonProperty
	private String excerpt;

	public String getDate() {
		return date;
	}

	public String getTitle() {
		return title;
	}

	public String getContent() {
		return content;
	}

	public String getExcerpt() {
		return excerpt;
	}

}
