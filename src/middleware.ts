import { NextRequest, NextResponse } from 'next/server';
import { getLinkFromServer } from './server/actions/link';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const slugRoute = nextUrl.pathname.split('/').pop() as string;

  const isHome = nextUrl.pathname === '/';

  if (isHome) {
    return NextResponse.next();
  }

  const getLink = await getLinkFromServer(slugRoute);

  if (getLink.error) {
    return NextResponse.json(
      {
        error: true,
        message: getLink.message,
      },
      {
        status: 404,
      }
    );
  }

  if (getLink.url) {
    return NextResponse.redirect(new URL(getLink.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
