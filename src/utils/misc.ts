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
