package tools;

import java.io.File;
import java.io.IOException;
import java.util.List;

import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.model.EmsSession;

import org.apache.commons.io.FileUtils;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;

public class VimeoStatsExporter {
	private static Client client = new Client();

	private static int suksess = 0;
	private static int feilet = 0;

	public static void main(final String[] args) {

		EmsService s = EmsService.getInstance();
		s.refresh();
		List<EmsSession> sessions = s.getConferenceYear().getSessions();
		for (EmsSession emsSession : sessions) {
			String videoLink = emsSession.getVideoLink().get().getHref().toString();
			String videoId = videoLink.substring(17);
			System.out.println(videoLink);
			System.out.println(videoId);
			loadStats(videoId);
			System.out.println("OK:" + suksess + ", FEILET:" + feilet);
		}

	}

	private static void loadStats(final String videoId) {
		ClientResponse response = client
				.resource("https://vimeo.com/stats/video/" + videoId + "/totals/export:csv")
				.header("Cookie",
						"auto_load_stats=1; hd_preference=1; ab_psb=1%7C7540193; embed_preferences=%7B%22width%22%3A%22500%22%2C%22title%22%3A0%2C%22byline%22%3A0%2C%22portrait%22%3A0%2C%22link%22%3A0%2C%22caption%22%3A0%2C%22color%22%3A%2200adef%22%2C%22clip_id%22%3A74553208%7D; site_settings=%7B%22browse_format%22%3A%22thumbnail%22%2C%22sticky_page%22%3Anull%7D; has_logged_in=1; __utma=18302654.780173035.1378907000.1381425142.1381435320.26; __utmb=18302654.9.8.1381435320; __utmc=18302654; __utmz=18302654.1379365994.11.5.utmcsr=codenameone.com|utmccn=(referral)|utmcmd=referral|utmcct=/3/post/2013/09/javazone-trip-report.html; __utmv=18302654.|2=user_type=pro=1^7=video_count=579=1; vimeo=eprtdsc2k7jpckmcdkt9tx7%2Cptf5rfvdu2s9sf9f5xdtwscdmxv50uuc20cvmx925; stats_start_date=2013%2F09%2F01; stats_end_date=2013%2F10%2F10; __utmli=stats_export")
				.get(ClientResponse.class);
		System.out.println(response.getStatus());
		String string = response.getEntity(String.class);
		if (response.getStatus() == 200) {
			try {
				File file = new File("/Users/eh/projects/JavaZone/resources/vimeo/" + videoId + ".csv");
				file.delete();
				FileUtils.writeStringToFile(file, string);
				suksess++;
			} catch (IOException e) {
				System.err.println("Feilet for id " + videoId);
				feilet++;
			}
		} else {
			System.err.println("Feilet for id " + videoId);
			feilet++;
		}

		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
