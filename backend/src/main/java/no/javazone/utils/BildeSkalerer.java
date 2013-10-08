package no.javazone.utils;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Method;
import org.imgscalr.Scalr.Mode;

public class BildeSkalerer {

	public static byte[] skalerPngBilde(final byte[] originalBildeBytes, final int maksBredde, final int maksHoyde) {
		BufferedImage orginalBilde = byteArrayTilBufferedImage(originalBildeBytes);
		BufferedImage skalertBilde = skalerTilBoks(orginalBilde, maksBredde, maksHoyde);
		return bufferedImageTilByteArray(skalertBilde);
	}

	private static BufferedImage skalerTilBoks(final BufferedImage original, final int maksBredde, final int maksHoyde) {
		double targetScale = ((double) maksBredde) / ((double) maksHoyde);
		double imgScale = ((double) original.getWidth()) / ((double) original.getHeight());
		Mode mode = imgScale > targetScale ? Mode.FIT_TO_WIDTH : Mode.FIT_TO_HEIGHT;
		return Scalr.resize(original, Method.ULTRA_QUALITY, mode, maksBredde, maksHoyde);
	}

	static BufferedImage byteArrayTilBufferedImage(final byte[] bildeData) {
		try {
			InputStream in = new ByteArrayInputStream(bildeData);
			BufferedImage bufferedImage = ImageIO.read(in);
			if (bufferedImage == null) {
				throw new RuntimeException();
			}
			return bufferedImage;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	static byte[] bufferedImageTilByteArray(final BufferedImage bufferedImage) {
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(bufferedImage, "png", baos);
			baos.flush();
			byte[] imageInByte = baos.toByteArray();
			baos.close();
			return imageInByte;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static byte[] cropTilFirkant(final byte[] ucroppet) {
		BufferedImage orginalBilde = byteArrayTilBufferedImage(ucroppet);
		int min = Math.min(orginalBilde.getHeight(), orginalBilde.getWidth());
		// TODO: bedre?
		BufferedImage croppet = orginalBilde.getSubimage(0, 0, min, min);
		return bufferedImageTilByteArray(croppet);
	}

}
