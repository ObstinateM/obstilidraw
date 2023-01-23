import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
  if (
    request.nextUrl.pathname.startsWith('/draw') &&
    !request.cookies.has('next-auth.session-token')
  ) {
    return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/`));
  }

  if (request.nextUrl.pathname === '/' && request.cookies.has('next-auth.session-token')) {
    return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/draw/list`));
  }
};
