package no.javazone.activities.video;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import no.javazone.activities.video.model.YouTubeVideo;
import no.javazone.representations.video.Video;
import no.javazone.representations.video.VideoInfo;
import no.javazone.server.PropertiesLoader;
import org.apache.commons.io.FileUtils;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class VideoActivity {

	private static final Logger LOG = LoggerFactory.getLogger(VideoActivity.class);

	private static final int CACHE_TIME_MINUTES = 1;

	private static final String YOUTUBE_URL = "http://gdata.youtube.com/feeds/api/videos/%s?v=2&alt=jsonc";

	private static VideoActivity videoActivity;

	private final Client jerseyClient;

	private VideoInfo videoInfoCached;
	private DateTime lastFetched;
	private DateTime lastSaved;

	private final List<VideoHolder> videos = new ArrayList<VideoActivity.VideoHolder>();

	private VideoActivity() {
		ClientConfig config = new DefaultClientConfig();
		config.getClasses().add(JacksonJsonProvider.class);
		jerseyClient = Client.create(config);

		videos.add(new VideoHolder("gameofcodes", "E3418SeWZfQ", loadVotes("gameofcodes")));
		videos.add(new VideoHolder("houseofcodes", "HXvm76e2X1Q", loadVotes("houseofcodes")));
		videos.add(new VideoHolder("writingbad", "5U1_KW6ww7Y", loadVotes("writingbad")));
	}

	private int loadVotes(final String film) {
		String resourcesPath = PropertiesLoader.getProperty("resources.basepath");
		String filePath = resourcesPath + "/" + film + "-votes.txt";
		try {
			String fileToString = FileUtils.readFileToString(new File(filePath));
			return Integer.parseInt(fileToString);
		} catch (Exception e) {
			LOG.warn("Kunne ikke parse fila " + filePath + ". Returnerer 0 votes");
			return 0;
		}
	}

	public static VideoActivity getInstance() {
		if (videoActivity == null) {
			videoActivity = new VideoActivity();
		}

		return videoActivity;
	}

	public VideoInfo getInfoCached(final String vote) {
		registerVote(vote);
		if (videoInfoCached == null || lastFetched == null || lastFetched.isBefore(DateTime.now().minusMinutes(CACHE_TIME_MINUTES))) {
			videoInfoCached = getInfo();
			lastFetched = new DateTime();
		}
		return videoInfoCached;
	}

	private void registerVote(final String vote) {
		for (VideoHolder video : videos) {
			if (video.outId.equals(vote)) {
				video.registerVote();
			}
		}
		saveVotes();
	}

	private void saveVotes() {
		if (lastSaved == null || lastSaved.isBefore(DateTime.now().minusMinutes(1))) {
			lastSaved = new DateTime();
			LOG.info("Lagrer voteantall til disk...");
			for (VideoHolder video : videos) {
				String resourcesPath = PropertiesLoader.getProperty("resources.basepath");
				String filePath = resourcesPath + "/" + video.outId + "-votes.txt";
				try {
					FileUtils.writeStringToFile(new File(filePath), String.valueOf(video.getVotes()));
				} catch (IOException e) {
					LOG.warn("Kunne ikke skrive votes til fila " + filePath + ". Voteantall=" + video.getVotes());
				}
			}
		}
	}

	private VideoInfo getInfo() {
		LOG.info("Henter videoinfo fra youtube");
		VideoInfo videoInfo = new VideoInfo();
		for (VideoHolder video : videos) {
			ClientResponse response = jerseyClient.resource(String.format(YOUTUBE_URL, video.youtubeId)).get(ClientResponse.class);
			if (response.getStatus() == Status.OK.getStatusCode()) {
				YouTubeVideo youTubeVideo = response.getEntity(YouTubeVideo.class);
				videoInfo.videos.put(video.outId, new Video(youTubeVideo.getViews(), youTubeVideo.getInteractions(), video.getVotes()));
			}
		}
		return videoInfo;
	}

	public static class VideoHolder {
		public String outId;
		public String youtubeId;

		private final AtomicInteger votes;

		public VideoHolder(final String outId, final String youtubeId, final int existingVotes) {
			this.outId = outId;
			this.youtubeId = youtubeId;
			votes = new AtomicInteger(existingVotes);
		}

		public int getVotes() {
			return votes.get();
		}

		public void registerVote() {
			votes.incrementAndGet();
		}
	}
}
