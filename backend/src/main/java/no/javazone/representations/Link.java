package no.javazone.representations;

import org.codehaus.jackson.annotate.JsonProperty;

public class Link {

	@JsonProperty("rel")
	private final String rel;
	@JsonProperty("uri")
	private final String uri;

	public Link(final String rel, final String uri) {
		this.rel = rel;
		this.uri = uri;
	}

}
