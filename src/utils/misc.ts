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

export const validateDate = (date: any) => {
  if (!date || isNaN(Date.parse(date))) {
    throw new Error(`${date} is not a valid Date object.`);
  }
  return date as Date;
};
