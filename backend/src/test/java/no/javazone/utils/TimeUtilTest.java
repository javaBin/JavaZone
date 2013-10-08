package no.javazone.utils;

import static org.junit.Assert.assertEquals;

import org.joda.time.DateTime;
import org.junit.Test;

public class TimeUtilTest {
	@Test
	public void skal() {
		doit("5 years ago", DateTime.now().minusYears(5));
		doit("5 months ago", DateTime.now().minusMonths(5));
		doit("3 weeks ago", DateTime.now().minusWeeks(3));
		doit("5 days ago", DateTime.now().minusDays(5));
		doit("5 minutes ago", DateTime.now().minusMinutes(5));
		doit("5 seconds ago", DateTime.now().minusSeconds(5));
		doit("now", DateTime.now().minusMillis(5));

		doit("now", DateTime.now().plusMillis(5));
		doit("now", DateTime.now().plusYears(5));

		doit("1 year ago", DateTime.now().minusYears(1));
		doit("1 month ago", DateTime.now().minusMonths(1));
		doit("1 week ago", DateTime.now().minusWeeks(1));
		doit("1 day ago", DateTime.now().minusDays(1));
		doit("1 minute ago", DateTime.now().minusMinutes(1));
		doit("1 second ago", DateTime.now().minusSeconds(1));
		doit("now", DateTime.now().minusMillis(1));

		doit("2 years ago", DateTime.now().minusYears(2).minusMonths(5).minusMinutes(6));
	}

	@Test
	public void skal2() {
		System.out.println(TimeUtil.generateRelativeDate(1368370253000L));
	}

	private void doit(final String expected, final DateTime dateTime) {
		String generated = TimeUtil.generateRelativeDate(dateTime.getMillis());
		System.out.println(generated);
		assertEquals(expected, generated);
	}
}
