//package tools;
//
//import java.util.List;
//
//import no.javazone.activities.ems.EmsService;
//import no.javazone.activities.ems.model.EmsSession;
//
//import com.sun.jersey.api.client.Client;
//import com.sun.jersey.api.client.ClientResponse;
//
//public class VimeoStatsExporter {
//	private static Client client = new Client();
//
//	private static int suksess = 0;
//	private static int feilet = 0;
//
//	public static void main(final String[] args) {
//
//		EmsService s = EmsService.getInstance();
//		s.refresh();
//		List<EmsSession> sessions = s.getConferenceYear().getSessions();
//		for (EmsSession emsSession : sessions) {
//			String videoLink = emsSession.getVideoLink().get().getHref().toString();
//			String videoId = videoLink.substring(17);
//			System.out.println(videoLink);
//			System.out.println(videoId);
//			loadStats(videoId);
//			System.out.println("OK:" + suksess + ", FEILET:" + feilet);
//		}
//
//	}
//
//	private static void loadStats(final String videoId) {
//		ClientResponse response = client
//				.resource("https://vimeo.com/stats/video/" + videoId + "/totals/export:csv")
//				.header("Cookie", "cookie")
//				.get(ClientResponse.class);
//		System.out.println(response.getStatus());
//		String string = response.getEntity(String.class);
//		if (response.getStatus() == 200) {
////			try {
//			System.out.println(string);
////				File file = new File("/Users/eh/projects/JavaZone/resources/vimeo/" + videoId + ".csv");
////				file.delete();
////				FileUtils.writeStringToFile(file, string);
//			suksess++;
////			} catch (IOException e) {
////				System.err.println("Feilet for id " + videoId);
////				feilet++;
////			}
//		} else {
//			System.err.println("Feilet for id " + videoId);
//			feilet++;
//		}
//
//		try {
//			Thread.sleep(1000);
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//	}
//
//}
