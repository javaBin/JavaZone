package no.javazone.activities.ems;

import no.javazone.activities.ems.model.ConferenceYear;
import no.javazone.activities.ems.model.EmsSession;
import no.javazone.activities.ems.model.EmsSpeaker;

import org.junit.Ignore;
import org.junit.Test;

public class EmsServiceTest {

	@Test
	@Ignore
	public void skalHenteDataFraEms() {
		int antall = 0;
		EmsService emsService = EmsService.getInstance();
		emsService.refresh();
		ConferenceYear conferenceYear = emsService.getConferenceYear();
		System.out.println("Refreshed: " + conferenceYear.getLastTimeRefreshed());
		for (EmsSession session : conferenceYear.getSessions()) {
			for (EmsSpeaker speaker : session.getSpeakerDetails()) {
				if (speaker.getEmsPhotoUrl().isSome()) {
					antall++;
				}
			}
			System.out.println(session.toString());
		}
		System.out.println(antall);
	}
}
