import AppError from '@/schemas/errors/appError';
import { ActionResponse } from '@/schemas/types';

export function handleActionError(
  err: unknown,
  defaultMessage: string = 'Noget gik galt'
): ActionResponse {
  if (err instanceof AppError) {
    if (err.httpCode === 400) {
      console.warn(err.details);
    } else {
      console.error(err.details);
    }

    return {
      success: false,
      loading: false,
      message: err.message,
    };
  } else {
    console.error('Unexpected error:', err);
    return {
      success: false,
      loading: false,
      message: defaultMessage,
    };
  }
}
