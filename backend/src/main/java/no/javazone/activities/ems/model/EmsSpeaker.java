package no.javazone.activities.ems.model;

import net.hamnaberg.json.Item;
import net.hamnaberg.json.Link;
import net.hamnaberg.json.util.Optional;
import no.javazone.activities.ems.ItemHelper;
import no.javazone.server.PropertiesLoader;
import no.javazone.utils.GravatarUtil;

import com.google.common.base.Function;

public class EmsSpeaker {

	private final String id;
	private final String name;
	private final String bio;
	private final Optional<Link> emsPhotoUrl;
	private final String email;
	private final String gravatarUrl;
	private byte[] smallPhoto;
	private byte[] largePhoto;

	public EmsSpeaker(final String id, final String name, final String bio, final Optional<Link> emsPhotoUrl, final String email,
			final String gravatarUrl) {
		this.id = id;
		this.name = name;
		this.bio = bio;
		this.emsPhotoUrl = emsPhotoUrl;
		this.email = email;
		this.gravatarUrl = gravatarUrl;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getBio() {
		return bio;
	}

	public Optional<Link> getEmsPhotoUrl() {
		return emsPhotoUrl;
	}

	public String getEmail() {
		return email;
	}

	public String getGravatarUrl() {
		return gravatarUrl;
	}

	public byte[] getSmallPhoto() {
		return smallPhoto;
	}

	public byte[] getLargePhoto() {
		return largePhoto;
	}

	public static Function<Item, EmsSpeaker> collectionItemToSpeaker() {
		return new Function<Item, EmsSpeaker>() {

			@Override
			public EmsSpeaker apply(final Item item) {
				String id = ItemHelper.generateId(item);

				String name = ItemHelper.getStringValue(item, "name");
				String bio = ItemHelper.getStringValue(item, "bio");

				Optional<Link> emsPhotoUrl = ItemHelper.getLink(item, "photo");

				String email = ItemHelper.getStringValue(item, "email");
				String gravatarUrl = GravatarUtil.emailToGravatarUrl(email);

				return new EmsSpeaker(id, name, bio, emsPhotoUrl, email, gravatarUrl);
			}
		};
	}

	public String getProfilePictureUrl() {
		if (emsPhotoUrl.isSome()) {
			return PropertiesLoader.getProperty("server.proxy") + "/speakers/" + id + "/image";
		} else {
			return gravatarUrl;
		}
	}

	public void setSmallPhoto(final byte[] smallPhoto) {
		this.smallPhoto = smallPhoto;

	}

	public void setLargePhoto(final byte[] largePhoto) {
		this.largePhoto = largePhoto;

	}

}
