package no.javazone.representations.video;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.HashMap;
import java.util.Map;

public class VideoInfo {

	@JsonProperty
	public Map<String, Video> videos = new HashMap<String, Video>();

}
