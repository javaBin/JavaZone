package no.javazone.activities.feedback;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import no.javazone.server.PropertiesLoader;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AnalyticsStats {

	private static final Logger LOG = LoggerFactory.getLogger(AnalyticsStats.class);

	private final Map<String, AnalyticsStat> stats = new HashMap<String, AnalyticsStat>();

	@SuppressWarnings("unchecked")
	public AnalyticsStats() {
		try {
			String basePath = PropertiesLoader.getProperty("resources.basepath");
			List<String> lines = FileUtils.readLines(new File(basePath + "/analytics.csv"));
			lines.remove(0);
			for (String line : lines) {
				String[] parts = line.split(",");
				String key = parts[0].substring(22);
				AnalyticsStat value = new AnalyticsStat(parts[1]);
				stats.put(key, value);
			}
		} catch (Exception e) {
			LOG.warn("Kunne ikke laste analytics-statistikk!", e);
		}
	}

	public AnalyticsStat getStatsForTalkId(final String id) {
		return stats.get(id);
	}

	public class AnalyticsStat {

		public final String pageviews;

		public AnalyticsStat(final String pageviews) {
			this.pageviews = pageviews;
		}

		@Override
		public String toString() {
			return "[pageviews=" + pageviews + "]";
		}

	}

}
