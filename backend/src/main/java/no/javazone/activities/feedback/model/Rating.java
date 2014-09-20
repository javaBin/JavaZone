package no.javazone.activities.feedback.model;

import java.util.List;

public class Rating {

	public double avg;
	public int red;
	public int yellow;
	public int green;

	public Rating(double avg, int red, int yellow, int green) {
		this.avg = avg;
		this.red = red;
		this.yellow = yellow;
		this.green = green;
	}

	public static Rating from(List<Integer> ratings) {
		int red = 0;
		int yellow = 0;
		int green = 0;
		for (Integer rating : ratings) {
			if(rating == 1) {
				red++;
			} else if (rating == 2) {
				yellow++;
			} else if (rating == 3) {
				green++;
			}
		}
		double sum = red * 1 + yellow * 2 + green * 3;
		double avg = -1;
		int numberOfRatings = red+green+yellow;
		if(numberOfRatings > 0) {
			avg = sum / numberOfRatings;
		}
		return new Rating(avg, red, yellow, green);
	}

}
