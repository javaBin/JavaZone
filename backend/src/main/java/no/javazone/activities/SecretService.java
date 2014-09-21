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
			return new String(new Base64(true).encode(hash)).trim();
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean checkSecret(String id, String secret) {
//		System.out.println("ID: " + id);
//		System.out.println("secret: " + secret);
//		System.out.println("calc: " + getSecretForValue(id));
//		System.out.println("equals: " + getSecretForValue(id).equals(secret));
		return getSecretForValue(id).equals(secret);
	}
	
}
