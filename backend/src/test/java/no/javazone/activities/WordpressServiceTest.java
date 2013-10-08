package no.javazone.activities;

import no.javazone.activities.wordpress.WordpressService;
import no.javazone.representations.wordpress.Bloggpost;
import no.javazone.representations.wordpress.Bloggposter;

import org.junit.Ignore;
import org.junit.Test;

@Ignore
public class WordpressServiceTest {

	@Test
	public void skal() {
		WordpressService wordpressService = WordpressService.getInstance();
		Bloggposter bloggposter = wordpressService.hentBloggposter();
		for (Bloggpost bloggpost : bloggposter.getPosts()) {
			System.out.println(String.format("%s, %s, %s, %s", bloggpost.getDate(), bloggpost.getTitle(), bloggpost.getExcerpt(),
					bloggpost.getContent()));
		}
	}

}
