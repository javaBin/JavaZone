package no.javazone.activities.feedback.model;

import java.util.List;

public class Rating {

	public double numberOfRatings;
	public double avg;

	public Rating(double numberOfRatings, double avg) {
		this.numberOfRatings = numberOfRatings;
		this.avg = avg;
	}

	public static Rating from(List<Integer> ratings) {
		double numberOfRatings = ratings.size();
		double sum = 0;
		for (Integer rating : ratings) {
			sum += rating;
		}
		double avg = -1;
		if(numberOfRatings > 0) {
			avg = sum / numberOfRatings;
		}
		return new Rating(numberOfRatings, avg);
	}

}
