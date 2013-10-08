package no.javazone.activities.ems;

import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.Lists.newArrayList;

import java.net.URI;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import net.hamnaberg.json.Item;
import net.hamnaberg.json.Link;
import net.hamnaberg.json.Property;
import net.hamnaberg.json.Value;
import net.hamnaberg.json.util.Optional;
import net.hamnaberg.json.util.Predicate;

import org.apache.commons.codec.binary.Hex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Function;

public class ItemHelper {

	private static final Logger LOG = LoggerFactory.getLogger(ItemHelper.class);

	public static Optional<Link> getLink(final Item item, final String rel) {
		return item.findLink(new Predicate<Link>() {

			@Override
			public boolean apply(final Link link) {
				return link.getRel().equals(rel);
			}
		});
	}

	public static List<Link> getLinks(final Item item, final String rel) {
		return item.findLinks(new Predicate<Link>() {

			@Override
			public boolean apply(final Link link) {
				return link.getRel().contains(rel);
			}
		});

	}

	public static String generateId(final Item item) {
		URI href = item.getHref();
		return new String(Hex.encodeHex(getMda().digest(href.toString().getBytes())));
	}

	private static MessageDigest getMda() {
		try {
			return MessageDigest.getInstance("SHA-256");
		} catch (NoSuchAlgorithmException e) {
			LOG.error("Kunne ikke lage SHA-256", e);
			throw new IllegalStateException();
		}
	}

	public static String getStringValue(final Item item, final String key) {
		Optional<Property> property = item.propertyByName(key);
		if (property.isNone()) {
			return "";
		}
		Optional<Value> value = property.get().getValue();
		if (value.isNone()) {
			return "";
		}
		return value.get().asString();
	}

	public static List<String> getArrayValue(final Item item, final String key) {
		Optional<Property> property = item.propertyByName(key);
		if (property.isNone()) {
			return newArrayList();
		}
		List<Value> value = property.get().getArray();
		return newArrayList(transform(value, new Function<Value, String>() {
			@Override
			public String apply(final Value value) {
				return value.asString();
			}
		}));
	}
}
