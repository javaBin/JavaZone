package tools;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;

import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.model.EmsSession;
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
			if(emsSession.getFormat().equals("workshop")) {
				continue;
			}
			if(emsSession.getVideoLink().isNone()) {
				System.out.println("mangler video for " + emsSession.getTitle());
				feilet++;
				continue;
			}
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
				.header("Cookie", "__gads=ID=6e18657557ea8f1c:T=1409789403:S=ALNI_MbyuAA3mweZ3yGUpTE3seqd5cKXDg; sticky_brozar=1; site_settings=%7B%22browse_format%22%3A%22thumbnail%22%7D; aka_debug=cpcode:84483~clientip:31.45.16.165~ghostip:193.212.178.178~requestid:610219b~time:1411222068~ghostforwardip:~edgecache:cache-hit~rtt:9~region:NO-; player=\"\"; auto_load_stats=1; __utma=18302654.2043629750.1409789407.1410880951.1411303014.11; __utmb=18302654.11.9.1411304047869; __utmc=18302654; __utmz=18302654.1410880951.10.4.utmcsr=t.co|utmccn=(referral)|utmcmd=referral|utmcct=/jvMfx8sGW3; __utmv=18302654.|2=user_type=pro=1^7=video_count=703=1; stats_start_date=2014%2F09%2F10; stats_end_date=2014%2F09%2F21; vimeo=eprtdsc2k7jpcdccksdstm7%2Cprxd0rrktuwtvxvd9x5cfcrs0fr9mmf20fvw0dmr5; vuid=1429376266.413696652; ab_bs=%7B%224%22%3A448%7D; __utmli=stats_export")
				.get(ClientResponse.class);
		System.out.println(response.getStatus());
		String string = response.getEntity(String.class);
		if (response.getStatus() == 200) {
			try {
			System.out.println(string);
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
