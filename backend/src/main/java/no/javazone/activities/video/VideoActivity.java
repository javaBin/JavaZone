package no.javazone.activities.video;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import no.javazone.activities.video.model.YouTubeVideo;
import no.javazone.representations.video.Video;
import no.javazone.representations.video.VideoInfo;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VideoActivity {

	private static final Logger LOG = LoggerFactory.getLogger(VideoActivity.class);

	private static final int CACHE_TIME_MINUTES = 1;

	private static final VideoToCheck[] VIDEOS = { new VideoToCheck("javapocalypse", "E3418SeWZfQ"),
			new VideoToCheck("javaheist", "HXvm76e2X1Q"), new VideoToCheck("thestreaming", "5U1_KW6ww7Y") };

	private static final String YOUTUBE_URL = "http://gdata.youtube.com/feeds/api/videos/%s?v=2&alt=jsonc";

	private static VideoActivity videoActivity;

	private final Client jerseyClient;

	private VideoInfo videoInfoCached;
	private DateTime lastFetched;

	private VideoActivity() {
		ClientConfig config = new DefaultClientConfig();
		config.getClasses().add(JacksonJsonProvider.class);
		jerseyClient = Client.create(config);
	}

	public static VideoActivity getInstance() {
		if (videoActivity == null) {
			videoActivity = new VideoActivity();
		}

		return videoActivity;
	}

	public VideoInfo getInfoCached() {
		if (videoInfoCached == null || lastFetched == null || lastFetched.isBefore(DateTime.now().minusMinutes(CACHE_TIME_MINUTES))) {
			videoInfoCached = getInfo();
			lastFetched = new DateTime();
		}
		return videoInfoCached;
	}

	private VideoInfo getInfo() {
		LOG.info("Henter videoinfo fra youtube");
		VideoInfo videoInfo = new VideoInfo();
		for (VideoToCheck video : VIDEOS) {
			ClientResponse response = jerseyClient.resource(String.format(YOUTUBE_URL, video.youtubeId)).get(ClientResponse.class);
			if (response.getStatus() == Status.OK.getStatusCode()) {
				YouTubeVideo youTubeVideo = response.getEntity(YouTubeVideo.class);
				// TODO: legg også på views av websiden på interactions
				videoInfo.videos.put(video.outId, new Video(youTubeVideo.getViews(), youTubeVideo.getInteractions()));
			}
		}
		return videoInfo;
	}

	public static class VideoToCheck {
		public String outId;
		public String youtubeId;

		public VideoToCheck(final String outId, final String youtubeId) {
			this.outId = outId;
			this.youtubeId = youtubeId;
		}
	}
}
