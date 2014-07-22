package no.javazone.utils;

import net.hamnaberg.json.util.Optional;
import net.hamnaberg.json.Link;
import net.hamnaberg.json.util.Predicate;
import net.hamnaberg.json.Item;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class GravatarUtil {

	public static String emailToGravatarUrl(final String email) {
		return "http://www.gravatar.com/avatar/" + md5Hex(email).toLowerCase();
	}

	private static String hex(final byte[] array) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < array.length; ++i) {
			sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1, 3));
		}
		return sb.toString();
	}

	private static String md5Hex(final String message) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			return hex(md.digest(message.getBytes("CP1252")));
		} catch (NoSuchAlgorithmException e) {
		} catch (UnsupportedEncodingException e) {
		}
		return null;
	}

	public static String getLink(Item item) {
		Optional<Link> link = item.findLink(new Predicate<Link>() {

			@Override
			public boolean apply(final Link link) {
				return link.getRel().equals("thumbnail") && link.getHref().toString().contains("gravatar");
			}
		});
		
		if(link.isSome()) {
			String url1 = link.get().getHref().toString();
			String url2 = url1.replaceAll("\\?.*", "");
			System.out.println("UUUUURL1: " + url1);
			System.out.println("UUUUURL2: " + url2);
			return url2;
		} else {
			System.out.println("NOOOO URL");
			return "http://www.gravatar.com/avatar/tulle-url";
		}
	}

}
