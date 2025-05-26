import sharp from 'sharp';
import { getMimeType } from './misc';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';

export async function convertToAvif(input: Blob | Buffer): Promise<Buffer> {
  const buffer =
    input instanceof Blob ? Buffer.from(await input.arrayBuffer()) : input;

  const mimetype = await getMimeType(buffer);

  if (!mimetype || !mimetype.includes('image/')) {
    throw new ErrorBadRequest(
      'Invalid image file type',
      `Expected an image file, but received: ${mimetype}`
    );
  }

  let avifBuffer: Buffer;
  if (mimetype !== 'image/avif') {
    avifBuffer = await sharp(buffer)
      .avif({
        quality: 50, // adjust quality (0–100)
        effort: 4, // 0–9, 9 = slowest, best compression
      })
      .toBuffer();
  } else {
    avifBuffer = buffer;
  }

  return avifBuffer;
}
