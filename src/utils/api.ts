import AppError from '@schemas/errors/appError';
import { ApiResponse } from '@schemas/types';
import { notFound } from 'next/navigation';

type InternalRoute =
  | `/brands`
  | '/accessories'
  | '/devices'
  | '/devices/search'
  | '/devices/valuation';

export default async function handleInternalApi<T = undefined>(
  path: InternalRoute,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const fullPath = '/api' + path;

  const res = await fetch(fullPath, {
    ...options,
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok) {
    console.error('Internal API error:', {
      status: res.status,
      path: fullPath,
      data,
    });

    if (res.status === 404) {
      notFound();
    }

    throw new AppError(
      data.message,
      `[${res.status}] ${res.statusText}: ${data.message}`
    );
  }

  return data;
}
