import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  let middlewareResponse: NextResponse;

  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (
    request.nextUrl.pathname.includes('admin') &&
    !request.nextUrl.pathname.startsWith('/admin/auth')
  ) {
    const SupabaseResponse = await updateSession(request);

    middlewareResponse = SupabaseResponse;
  } else {
    middlewareResponse = NextResponse.next();
  }

  // Custom headers
  middlewareResponse.headers.set(
    'x-search-params',
    request.nextUrl.searchParams.toString()
  );
  middlewareResponse.headers.set(
    'x-pathname',
    request.nextUrl.pathname.toString()
  );

  return middlewareResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
