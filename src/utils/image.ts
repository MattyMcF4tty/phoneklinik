import sharp from 'sharp';
import { getMimeType } from './misc';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';

export async function convertToAvif(
  input: Blob | Buffer | File
): Promise<Buffer> {
  // convert input to Buffer
  let buffer: Buffer<ArrayBufferLike>;

  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (input instanceof File) {
    buffer = Buffer.from(await input.arrayBuffer());
  } else if (input instanceof Blob) {
    buffer = Buffer.from(await input.arrayBuffer());
  } else {
    throw new ErrorBadRequest(
      'Invalid input type',
      `Expected Blob, File, or Buffer. Got: ${typeof input}`
    );
  }

  // get the MIME type of the image
  const mimetype = await getMimeType(buffer);

  // check if the MIME type is an image
  if (!mimetype || !mimetype.includes('image/')) {
    throw new ErrorBadRequest(
      'Invalid image file type',
      `Invalid file MIME type. Expected image/* MIME type. Got: ${mimetype}`
    );
  }

  // convert to AVIF format if not already in AVIF
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
