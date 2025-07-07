export default class AppError extends Error {
  details: string;
  httpCode: number;
  grade: 'info' | 'warning' | 'error';

  /**
   * AppError is the base class for all custom application-level errors.
   * It extends the native JavaScript Error class and adds support for:
   * @param message - A short, user-facing error message
   * @param details - A developer-facing description or context for debugging.
   * @param options - Optional metadata:
   *   @param options.httpCode - The HTTP status code that should be returned [`default: 500`].
   *   @param options.grade - A UI severity level ('info' | 'warning' | 'error'), used for toast styling or logging levels [`default: 'error'`].
   */
  constructor(
    message: string,
    details: string,
    options?: {
      httpCode?: number;
      grade?: 'info' | 'warning' | 'error';
    }
  ) {
    super(message);

    this.details = details;
    this.httpCode = options?.httpCode || 500; // Default to 500
    this.grade = options?.grade || 'error'; // Default to error
  }
}
