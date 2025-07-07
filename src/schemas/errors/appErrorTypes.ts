import AppError from './appError';

export class ErrorNotFound extends AppError {
  constructor(message: string, details: string) {
    super(message, details, { grade: 'warning', httpCode: 404 });
  }
}

export class ErrorInternal extends AppError {
  constructor(message: string, details: string) {
    super(message, details, { grade: 'error', httpCode: 500 });
  }
}

export class ErrorUnauthorized extends AppError {
  constructor(message: string, details: string) {
    super(message, details, { grade: 'error', httpCode: 401 });
  }
}

export class ErrorBadRequest extends AppError {
  constructor(message: string, details: string) {
    super(message, details, { grade: 'warning', httpCode: 400 });
  }
}

export class ErrorSupabase extends AppError {
  constructor(message: string, details: string) {
    super(message, details, { grade: 'error', httpCode: 500 });
  }
}
