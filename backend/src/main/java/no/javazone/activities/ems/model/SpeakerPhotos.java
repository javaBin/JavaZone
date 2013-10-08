package no.javazone.activities.ems.model;

import no.javazone.utils.BildeSkalerer;

import org.joda.time.DateTime;

public class SpeakerPhotos {

	private static final int CACHELEVETID_MINUTTER = 60;

	public static final int SMALL = 36;
	public static final int LARGE = 200;

	private final byte[] liteBildes;
	private final byte[] stortBildes;

	private final DateTime hentet;

	public SpeakerPhotos(final byte[] uskalertBilde) {
		byte[] firkantBilde = BildeSkalerer.cropTilFirkant(uskalertBilde);

		liteBildes = BildeSkalerer.skalerPngBilde(firkantBilde, SMALL, SMALL);
		stortBildes = BildeSkalerer.skalerPngBilde(firkantBilde, LARGE, LARGE);

		hentet = DateTime.now();
	}

	public byte[] getLiteBilde() {
		return liteBildes;
	}

	public byte[] getStortBilde() {
		return stortBildes;
	}

	public boolean erGammelt() {
		return hentet.isBefore(DateTime.now().minusMinutes(CACHELEVETID_MINUTTER));
	}

}
