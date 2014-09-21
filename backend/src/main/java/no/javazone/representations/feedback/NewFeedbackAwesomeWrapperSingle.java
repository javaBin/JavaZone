package no.javazone.representations.feedback;

import no.javazone.activities.feedback.PaperFeedbackService;

import no.javazone.activities.feedback.PaperFeedbackService.RoomStats;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class NewFeedbackAwesomeWrapperSingle {

	@JsonProperty
	private NewFeedbackAwesome feedback;
	@JsonProperty
	private int redWebRatings;
	@JsonProperty
	private int yellowWebRatings;
	@JsonProperty
	private int greenWebRatings;
	@JsonProperty
	private double averageWebRatings;
	@JsonProperty
	private int redPaperRatings;
	@JsonProperty
	private int yellowPaperRatings;
	@JsonProperty
	private int greenPaperRatings;
	@JsonProperty
	private List<Double> paperHistogramData;
	@JsonProperty
	private List<Double> webHistogramData;
	@JsonProperty
	private RoomStats roomStats;

	public NewFeedbackAwesomeWrapperSingle(
			int redWebRatings, int yellowWebRatings, int greenWebRatings, double averageWebRatings, 
			NewFeedbackAwesome feedback,
			int redPaperRatings, int yellowPaperRatings, int greenPaperRatings, 
			List<Double> paperHistogramData, List<Double> webHistogramData, PaperFeedbackService.RoomStats roomStats) {
		this.yellowWebRatings = yellowWebRatings;
		this.redWebRatings = redWebRatings;
		this.greenWebRatings = greenWebRatings;
		this.averageWebRatings = averageWebRatings;
		this.feedback = feedback;
		this.redPaperRatings = redPaperRatings;
		this.yellowPaperRatings = yellowPaperRatings;
		this.greenPaperRatings = greenPaperRatings;
		this.paperHistogramData = paperHistogramData;
		this.webHistogramData = webHistogramData;
		this.roomStats = roomStats;
	}

}
