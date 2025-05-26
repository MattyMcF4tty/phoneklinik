export type ActionResponse = {
  success: boolean | undefined;
  loading?: boolean;
  message: string;
};

export type ApiResponse<T = undefined> = {
  success: boolean | undefined;
  message: string;
  data?: T;
};
