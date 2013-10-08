package no.javazone.representations.sessions;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.List;

import no.javazone.activities.ems.model.EmsSpeaker;

import org.codehaus.jackson.annotate.JsonProperty;

import com.google.common.base.Function;

public class Speaker {

	@JsonProperty("name")
	private final String name;
	@JsonProperty("bio")
	private final String bio;
	@JsonProperty("gravatarUrl")
	private final String gravatarUrl;

	public Speaker(final String name, final String bio, final String gravatarUrl) {
		this.name = name;
		this.bio = bio;
		this.gravatarUrl = gravatarUrl;
	}

	public static List<Speaker> createSpeakers(final List<EmsSpeaker> speakers) {
		return newArrayList(transform(speakers, Speaker.emsSpeakerToSpeaker()));
	}

	private static Function<EmsSpeaker, Speaker> emsSpeakerToSpeaker() {
		return new Function<EmsSpeaker, Speaker>() {
			@Override
			public Speaker apply(final EmsSpeaker item) {
				return new Speaker(item.getName(), item.getBio(), item.getProfilePictureUrl());
			}
		};
	}
}
