package no.javazone.representations;

import org.codehaus.jackson.annotate.JsonProperty;

public class Feilmelding {

	@JsonProperty
	public final String beskrivelse;

	public Feilmelding(final String errormessage) {
		this.beskrivelse = errormessage;
	}

}
