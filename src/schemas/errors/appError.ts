export default class AppError extends Error {
  httpCode: number;
  details: string;

  constructor(message: string, details: string, code?: number) {
    super(message);

    this.httpCode = code || 500;
    this.details = details;
  }
}
