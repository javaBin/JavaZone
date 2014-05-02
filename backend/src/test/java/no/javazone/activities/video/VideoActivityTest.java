package no.javazone.activities.video;

import no.javazone.representations.video.VideoInfo;
import org.junit.Test;

public class VideoActivityTest {

	@Test
	public void skal() {
		VideoInfo info = VideoActivity.getInstance().getInfoCached();
		System.out.println(info.videos.size());
	}

}
