package no.javazone.activities;

import no.javazone.server.PropertiesLoader;
import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SecretService {

	public static String getSecretForValue(String value) {
		try {
			String secretPlain = value + PropertiesLoader.getProperty("api.secret");
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest(secretPlain.getBytes("UTF-8"));
			return new String(Base64.encodeBase64(hash));
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}
	
}
