package no.javazone.activities.feedback;

import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.server.PropertiesLoader;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.google.common.collect.Collections2.filter;
import static com.google.common.collect.Lists.newArrayList;

public class PaperFeedbackService {

	private JsonNode jsonNode;

	public PaperFeedbackService() {
		try {
			String resourcesBasepath = PropertiesLoader.getProperty("resources.basepath");
			String jsonString = IOUtils.toString(FileUtils.openInputStream(new File(resourcesBasepath + "/javazone2014_feedback.json")));
			ObjectMapper objectMapper = new ObjectMapper();
			jsonNode = objectMapper.readValue(jsonString, JsonNode.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public Optional<PaperFeedback> getFeedback(EmsSession emsSession) {
		for (JsonNode feedback : jsonNode) {
			if (feedback.findValue("sessiontitle").asText().equals(emsSession.getTitle())) {
				return Optional.of(new PaperFeedback(feedback.findValue("red").asInt(), feedback.findValue("yellow").asInt(), feedback
						.findValue("green")
						.asInt()));
			}
		}
		return Optional.absent();
	}

	public List<Double> getHistogramData() {
		List<Double> scores = new ArrayList<>();
		for (JsonNode feedback : jsonNode) {
			double red = feedback.findValue("red").asInt();
			double yellow = feedback.findValue("yellow").asInt();
			double green = feedback.findValue("green").asInt();
			double sum = red + yellow + green;
			if (sum > 0) {
				double score = (red * 1 + yellow * 2 + green * 3) / sum;
				scores.add(Math.floor(score * 10) / 10);
			}
		}
		return scores;
	}

	public PaperFeedback getFeedbackAllTalks() {
		PaperFeedback paperFeedback = new PaperFeedback(0, 0, 0);
		for (JsonNode feedback : jsonNode) {
			paperFeedback.red += feedback.findValue("red").asInt();
			paperFeedback.yellow += feedback.findValue("yellow").asInt();
			paperFeedback.green += feedback.findValue("green").asInt();
		}
		return paperFeedback;
	}

	public RoomStats getRoomStats(List<EmsSession> emsSessions, EmsSession thisEmsSession) {
		Map<String, RoomAverage> averagesPerRoom = new HashMap<>();

		String thisRoomName = thisEmsSession.getRoom();
		int thisRoomCount = 0;
		for (JsonNode feedback : jsonNode) {
			if (feedback.findValue("sessiontitle").asText().equals(thisEmsSession.getTitle())) {
				thisRoomCount = feedback.findValue("participants").asInt();
			}
		}

		for (EmsSession emsSession : emsSessions) {
			for (JsonNode feedback : jsonNode) {
				if (feedback.findValue("sessiontitle").asText().equals(emsSession.getTitle())) {
					int participants = feedback.findValue("participants").asInt();
					RoomAverage roomAverage = averagesPerRoom.get(emsSession.getRoom());
					if (roomAverage == null) {
						roomAverage = new RoomAverage(emsSession.getRoom());
						averagesPerRoom.put(emsSession.getRoom(), roomAverage);
					}
					roomAverage.update(participants);
				}
			}
		}
		RoomStats roomStats = new RoomStats(thisEmsSession.getTitle(), thisRoomCount, thisRoomName, averagesPerRoom);
		return roomStats;
	}

	public class RoomStats {

		@JsonProperty
		private int thisRoomCount;
		@JsonProperty
		private String thisRoomName;
		@JsonProperty
		private Map<String, RoomAverage> averagesPerRoom;
		
		private String sessionTitle;

		public RoomStats(String sessionTitle, int thisRoomCount, String thisRoomName, Map<String, RoomAverage> averagesPerRoom) {
			this.sessionTitle = sessionTitle;
			this.thisRoomCount = thisRoomCount;
			this.thisRoomName = thisRoomName;
			this.averagesPerRoom = averagesPerRoom;
		}

		@Override
		public String toString() {
			return "RoomStats [thisRoomCount=" + thisRoomCount + ", thisRoomName=" + thisRoomName + ", averagesPerRoom=" + averagesPerRoom
					+ ", sessionTitle=" + sessionTitle + "]";
		}

	}

	class RoomAverage {

		private double count = 0;
		private double total = 0;

		@JsonProperty
		public String name;

		@JsonProperty
		public double getAverage() {
			return total / count;
		}

		public RoomAverage(String name) {
			this.name = name;
		}

		public void update(int participants) {
			if (participants > 0) {
				count++;
				total += participants;
			}
		}

		@Override
		public String toString() {
			return "RoomAverage [count=" + count + ", total=" + total + ", name=" + name + "]";
		}

	}

	public static void main(String[] args) {
//		EmsService emsService = EmsService.getInstance();
//		emsService.refresh();
//		PaperFeedbackService paperFeedbackService = new PaperFeedbackService();
//
//		List<EmsSession> sessions = newArrayList(filter(emsService.getConferenceYear().getSessions(), new Predicate<EmsSession>() {
//			@Override
//			public boolean apply(EmsSession input) {
//				return !input.getFormat().contains("workshop") && !input.getFormat().contains("lightning");
//			}
//		}));
//
//		paperFeedbackService.getRoomStats(sessions, sessions.get(0));

//		System.err.println("---------------------");
//		
//		for (EmsSession s : emsService.getConferenceYear().getSessions()) {
//			Optional<PaperFeedback> feedback = paperFeedbackService.getFeedback(s);
//			System.out.println(s.getFormat() + " – "  + s.getTitle() + ": " + feedback.toString());
//			if(s.getFormat().equals("presentation") && !feedback.isPresent()) {
//				System.err.println("mangler for presentasjon");
//			}
//		}

		List<Double> histogramData = new PaperFeedbackService().getHistogramData();
		System.out.println(histogramData);

	}

	class PaperFeedback {

		public int red;
		public int yellow;
		public int green;

		public PaperFeedback(int red, int yellow, int green) {
			this.red = red;
			this.yellow = yellow;
			this.green = green;
		}

		@Override
		public String toString() {
			return "PaperFeedback [red=" + red + ", yellow=" + yellow + ", green=" + green + "]";
		}

	}

}
