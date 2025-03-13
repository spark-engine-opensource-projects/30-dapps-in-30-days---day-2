
      import { NextResponse } from 'next/server';

      export function middleware(request) {
        // Example: Always redirect root path to the first page
        if (request.nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/Home', request.url));
        }
        return NextResponse.next();
      }
    