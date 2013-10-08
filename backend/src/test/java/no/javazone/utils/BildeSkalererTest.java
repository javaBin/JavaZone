package no.javazone.utils;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.junit.Ignore;
import org.junit.Test;

public class BildeSkalererTest {

	@Test
	@Ignore
	public void skalSkalereBilderKorrekt() throws IOException {
		byte[] uskalert = FileUtils.readFileToByteArray(new File("/Users/eh/test/hoyt.jpg"));
		byte[] croppet = BildeSkalerer.cropTilFirkant(uskalert);

		byte[] skalert = BildeSkalerer.skalerPngBilde(croppet, 50, 50);
		FileUtils.writeByteArrayToFile(new File("/Users/eh/test/skalert.jpg"), skalert);
	}

}
