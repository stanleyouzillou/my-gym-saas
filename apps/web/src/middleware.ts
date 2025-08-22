import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

// In dev without Clerk keys, no-op middleware so app still runs
export default hasClerkKeys
  ? clerkMiddleware()
  : function middleware() {
      return NextResponse.next();
    };

// Standard matcher from Clerk docs for Next.js (matches all pages and API except static/_next)
export const config = {
  matcher: [
    // match all paths except static files and _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    // also run on API and RPC routes
    '/(api|trpc)(.*)',
  ],
};
