import { NextRequest, NextResponse } from "next/server"

import jwt from "jsonwebtoken";

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/in-development', whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path)
  const authToken = request.cookies.get('token')?.value

  if(!authToken && publicRoute) {
    return NextResponse.next()
  }

  if(!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'

    return NextResponse.redirect(redirectUrl)
  }

  if(authToken && !publicRoute) {
    try {
      jwt.verify(authToken, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  }

  return NextResponse.next()
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
}