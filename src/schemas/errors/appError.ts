export default class AppError extends Error {
  httpCode: number;
  details: string;

  constructor(message: string, details: string, httpCode?: number) {
    super(message);

    this.httpCode = httpCode || 500;
    this.details = details;
  }
}
