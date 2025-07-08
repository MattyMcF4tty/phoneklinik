import Accessory from '@schemas/accessory';
import Brand from '@schemas/brand';
import Device from '@schemas/device';
import AppError from '@schemas/errors/appError';
import RepairBooking from '@schemas/repairBooking';
import { ApiResponse } from '@schemas/types';
import { notFound } from 'next/navigation';

type ApiRouteMap = {
  '/brands': {
    POST: Brand;
    PATCH: Brand;
  };
  '/devices': {
    GET: Device[];
    POST: Device;
    PATCH: Device;
  };
  '/devices/search': {
    GET: Pick<Device, 'id' | 'brand' | 'model' | 'version'>[];
  };
  '/devices/valuation': {
    POST: undefined;
  };
  '/accessories': {
    POST: undefined;
    PATCH: Accessory;
  };
  '/repair-bookings': {
    GET: RepairBooking[];
  };
  '/repair-bookings/available': {
    GET: string[];
  };
};

export default async function handleInternalApi<
  R extends keyof ApiRouteMap,
  M extends keyof ApiRouteMap[R]
>(
  path: R,
  options: (RequestInit & { method: M }) & {
    params?: Record<
      string,
      string | number | boolean | (string | number | boolean)[]
    >;
  }
): Promise<ApiResponse<ApiRouteMap[R][M]>> {
  // Serialize params into query string if provided
  let fullPath = '/api' + path;

  if (options.params) {
    const query = new URLSearchParams();

    Object.entries(options.params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    });

    fullPath += `?${query.toString()}`;
  }

  const res = await fetch(fullPath, {
    ...options,
  });

  const data: ApiResponse<ApiRouteMap[R][M]> = await res.json();

  if (!res.ok) {
    console.error('Internal API error:', {
      status: res.status,
      path: fullPath,
      data,
    });

    if (res.status === 404) {
      notFound();
    }

    // http codes that will lead to crash
    if (res.status === 500) {
      throw new AppError(
        data.message,
        `[${res.status}] ${res.statusText}: ${data.message}`
      );
    }
  }

  return data;
}
