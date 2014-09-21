package no.javazone.activities.feedback;

import com.google.common.base.Optional;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.server.PropertiesLoader;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
			if(feedback.findValue("sessiontitle").asText().equals(emsSession.getTitle())) {
				return Optional.of(new PaperFeedback(
						feedback.findValue("red").asInt(),
						feedback.findValue("yellow").asInt(),
						feedback.findValue("green").asInt()
				));
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
			double sum = red+yellow+green;
			if(sum > 0) {
				double score = (red*1 + yellow*2 + green*3) / sum;
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

	public static void main(String[] args) {
//		EmsService emsService = EmsService.getInstance();
//		emsService.refresh();
//		PaperFeedbackService paperFeedbackService = new PaperFeedbackService();
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
