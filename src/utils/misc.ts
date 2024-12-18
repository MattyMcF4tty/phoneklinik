import { emailRegex } from '@/schemas/customTypes';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const validateEmail = (email: string) => {
  if (emailRegex.test(email)) {
    throw new Error(`${email} is not a valid email`);
  }
  return email;
};

export const validateTime = (time: string) => {
  if (emailRegex.test(time)) {
    throw new Error(`${time} is not a valid time. Must be HH:MM:SS`);
  }
  return time;
};

export const validateDate = (dateString: string) => {
  if (!dateString || isNaN(Date.parse(dateString))) {
    throw new Error(`${dateString} is not a valid Date object.`);
  }

  const formattedDate = new Date(dateString);
  return formattedDate as Date;
};

export const decodeUrlSpaces = (input: string): string => {
  return input.replace(/%20/g, ' ');
};

export const sendMail = async (title: string, body: string) => {
  const response = await fetch(`${getBaseUrl()}/api/email`, {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
      title: title,
      body: body,
    }),
  });

  if (!response.ok) {
    const error = (await response.json()).error;
    throw new Error(error);
  }
};

export const createDateTimeObject = (date: string, time: string): Date => {
  return new Date(`${date}T${time}:00`);
};

export const isTimeReserved = (
  datetime: Date,
  reservedTimes: Date[]
): boolean => {
  return reservedTimes.some(
    (reserved) => reserved.getTime() === datetime.getTime()
  );
};

export const generateTimeSlots = (): string[] => {
  const slots = [];
  const start = 10; // Start time in hours
  const end = 18; // End time in hours

  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour}:00`, `${hour}:30`);
  }

  return slots;
};

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: Use `window.location`
    return `${window.location.protocol}//${window.location.host}`;
  } else {
    // Server-side: Use `process.env.NEXT_PUBLIC_VERCEL_URL` or fall back to localhost
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    return vercelUrl
      ? `https://${vercelUrl}`
      : `http://localhost:${process.env.PORT || 3000}`;
  }
};
