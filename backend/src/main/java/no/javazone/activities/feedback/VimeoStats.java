package no.javazone.activities.feedback;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import no.javazone.server.PropertiesLoader;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VimeoStats {

	private static final Logger LOG = LoggerFactory.getLogger(VimeoStats.class);

	private final Map<String, VimeoStat> stats = new HashMap<String, VimeoStat>();

	@SuppressWarnings("unchecked")
	public VimeoStats() {
		try {
			String basePath = PropertiesLoader.getProperty("resources.basepath");
			List<String> lines = FileUtils.readLines(new File(basePath + "/vimeo.csv"));
			for (String line : lines) {
				String[] parts = line.split(",");
				String key = parts[22].substring(1);
				VimeoStat value = new VimeoStat(parts[16], parts[13], parts[19]);
				stats.put(key, value);
			}
		} catch (Exception e) {
			LOG.warn("Kunne ikke laste vimeo-statistikk!");
		}
	}

	public VimeoStat getStatsForVideoId(final Integer videoId) {
		return stats.get(videoId);
	}

	public class VimeoStat {

		public final String totalPlays;
		public final String totalLoads;
		public final String totalFinishes;

		public VimeoStat(final String totalPlays, final String totalLoads, final String totalFinishes) {
			this.totalPlays = totalPlays;
			this.totalLoads = totalLoads;
			this.totalFinishes = totalFinishes;
		}

		@Override
		public String toString() {
			return "[totalPlays=" + totalPlays + ", totalLoads=" + totalLoads + ", totalFinishes=" + totalFinishes + "]";
		}

	}

}
