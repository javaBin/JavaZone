package no.javazone.activities.feedback;

import org.codehaus.jackson.annotate.JsonProperty;

import java.io.File;
import java.io.IOException;
import java.util.List;

import no.javazone.server.PropertiesLoader;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VimeoStatsSingle {

	private static final Logger LOG = LoggerFactory.getLogger(VimeoStatsSingle.class);

	@SuppressWarnings("unchecked")
	public VimeoStat getStatsForVideoId(final Integer videoId) {
		try {
			String basePath = PropertiesLoader.getProperty("resources.basepath");
			List<String> lines = FileUtils.readLines(new File(basePath + "/vimeo/" + videoId + ".csv"));
			lines.remove(0);
			int loads = 0;
			int plays = 0;
			int downloads = 0;
			int likes = 0;
			for (String line : lines) {
				String[] split = line.split(",");
				loads += Integer.parseInt(split[13]);
				plays += Integer.parseInt(split[16]);
				downloads += Integer.parseInt(split[11]);
				likes += Integer.parseInt(split[12]);
			}
			return new VimeoStat(loads, plays, downloads, likes);
		} catch (IOException e) {
			LOG.warn("Kunne ikke laste vimeo-statistikk!");
			return new VimeoStat(0, 0, 0, 0);
		}
	}

	public class VimeoStat {
		@JsonProperty
		public final int loads;
		@JsonProperty
		public final int plays;
		@JsonProperty
		public final int downloads;
		@JsonProperty
		public final int likes;

		public VimeoStat(final int loads, final int plays, final int downloads, final int likes) {
			this.loads = loads;
			this.plays = plays;
			this.downloads = downloads;
			this.likes = likes;
		}

	}

}
