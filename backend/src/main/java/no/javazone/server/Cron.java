package no.javazone.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Timer;
import java.util.TimerTask;

import no.javazone.activities.ems.EmsService;
import no.javazone.activities.ems.SpeakerService;

public class Cron {
	
	private static final Logger LOG = LoggerFactory.getLogger(Cron.class);
	
	private static final int TEN_MINUTES_IN_MS = 1000*60*10;

	private static Cron instance;
	
	Timer timer = new Timer();
	EmsService emsService = EmsService.getInstance();
	SpeakerService speakerService = SpeakerService.getInstance();

	public static Cron getInstance() {
		if(instance == null) {
			instance = new Cron();
		}
		return instance;
	}

	public void init() {
		emsService.refresh();
		speakerService.forceRefresh();
		
		LOG.info("Setter opp Cron-jobb – refresh av talks og speakerbilder...");
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				LOG.info("Kjører Cron-jobb – refresh av talks og speakerbilder...");
				emsService.refresh();
				speakerService.softRefresh();
				LOG.info("Ferdig med Cron-jobb – refresh av talks og speakerbilder...");
			}
		}, TEN_MINUTES_IN_MS, TEN_MINUTES_IN_MS);
	}

}
