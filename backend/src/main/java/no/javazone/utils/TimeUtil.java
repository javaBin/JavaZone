package no.javazone.utils;

import org.joda.time.DateTime;
import org.joda.time.Period;

public class TimeUtil {
	public static String generateRelativeDate(final long millis) {
		DateTime then = new DateTime(millis);
		DateTime now = DateTime.now();

		Period period = new Period(then, now);

		if (period.getYears() > 0) {
			return pluralize(period.getYears(), "year");
		} else if (period.getMonths() > 0) {
			return pluralize(period.getMonths(), "month");
		} else if (period.getWeeks() > 0) {
			return pluralize(period.getWeeks(), "week");
		} else if (period.getDays() > 0) {
			return pluralize(period.getDays(), "day");
		} else if (period.getHours() > 0) {
			return pluralize(period.getHours(), "hour");
		} else if (period.getMinutes() > 0) {
			return pluralize(period.getMinutes(), "minute");
		} else if (period.getSeconds() > 0) {
			return pluralize(period.getSeconds(), "second");
		} else {
			return "now";
		}
	}

	private static String pluralize(final int duration, final String base) {
		String toReturn = duration + " " + base;
		if (duration > 1) {
			toReturn += "s";
		}
		toReturn += " ago";
		return toReturn;
	}
}
