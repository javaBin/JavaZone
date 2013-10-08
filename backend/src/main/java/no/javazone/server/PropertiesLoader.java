package no.javazone.server;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PropertiesLoader {

	private static final Logger LOG = LoggerFactory.getLogger(PropertiesLoader.class);

	private static Properties properties;

	public static void initialize() {
		try {
			String propertyFilePath = System.getProperty("propertyFile");
			LOG.info("Laster properties fra filen: " + propertyFilePath);
			LOG.info("--------PROPERTIES-----------");
			File propertyFile = new File(propertyFilePath);
			properties = new Properties();
			properties.load(new FileInputStream(propertyFile));
			for (Object key : properties.keySet()) {
				LOG.info(key + "=" + properties.getProperty(key.toString()));
			}
			LOG.info("-----------------------------");
		} catch (FileNotFoundException e) {
			LOG.error("Kunne ikke laste properties", e);
		} catch (IOException e) {
			LOG.error("Kunne ikke laste properties", e);
		}
	}

	public static String getProperty(final String key) {
		if (properties == null) {
			initialize();
		}
		Object property = properties.get(key);
		if (property == null) {
			LOG.warn("Fant ikke property for key=" + key);
			throw new IllegalStateException("Mangler property");
		}
		return property.toString().trim();
	}
}
