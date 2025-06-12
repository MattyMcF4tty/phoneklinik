import { fileTypeFromBuffer } from 'file-type';

import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { emailRegex } from '@/schemas/types';
import { headers } from 'next/headers';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const validateEmail = (email: string) => {
  if (emailRegex.test(email)) {
    throw new Error(`${email} is not a valid email`);
  }
  return email;
};

export const validateDate = (dateString: string) => {
  if (!dateString || isNaN(Date.parse(dateString))) {
    throw new Error(`${dateString} is not a valid Date object.`);
  }

  const formattedDate = new Date(dateString);
  return formattedDate as Date;
};

export async function getMimeType(buffer: Buffer): Promise<string | undefined> {
  const fileType = await fileTypeFromBuffer(buffer);
  return fileType?.mime;
}

export async function getSearchParamsFromHeaders(): Promise<URLSearchParams> {
  const headersList = await headers();
  const rawParams = headersList.get('x-search-params');

  // Ensure it's in the format "?id=123"
  const search = rawParams?.startsWith('?') ? rawParams : `?${rawParams || ''}`;

  return new URLSearchParams(search);
}
