export type ActionResponse<T = undefined> = {
  success: boolean | undefined;
  loading?: boolean;
  message: string;
  data?: T;
};

type ApiResponseSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiResponseError = {
  success: false;
  message: string;
  data?: undefined;
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type InferActionData<A> = A extends (
  formData: FormData
) => Promise<ActionResponse<infer T>>
  ? T
  : never;
