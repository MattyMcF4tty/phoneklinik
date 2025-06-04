export type ActionResponse<T = undefined> = {
  success: boolean | undefined;
  loading?: boolean;
  message: string;
  data?: T;
};

export type ApiResponse<T = undefined> = {
  success: boolean | undefined;
  message: string;
  data?: T;
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
