package no.javazone.representations.sessions;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.util.List;

import no.javazone.activities.ems.model.EmsSpeaker;

import org.codehaus.jackson.annotate.JsonProperty;

import com.google.common.base.Function;

public class SimpleSpeaker {
	@JsonProperty("name")
	private final String name;
	@JsonProperty("gravatarUrl")
	private final String gravatarUrl;

	public SimpleSpeaker(final String name, final String gravatarUrl) {
		this.name = name;
		this.gravatarUrl = gravatarUrl;
	}

	public static List<SimpleSpeaker> createSpeakers(final List<EmsSpeaker> speakers) {
		return newArrayList(transform(speakers, SimpleSpeaker.emsSpeakerToSimpleSpeaker()));
	}

	private static Function<EmsSpeaker, SimpleSpeaker> emsSpeakerToSimpleSpeaker() {
		return new Function<EmsSpeaker, SimpleSpeaker>() {
			@Override
			public SimpleSpeaker apply(final EmsSpeaker item) {
				return new SimpleSpeaker(item.getName(), item.getProfilePictureUrl());
			}
		};
	}
}
