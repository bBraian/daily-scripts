import { NextRequest, NextResponse } from "next/server"

import jwt from "jsonwebtoken";

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/in-development', whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

const SECRET = process.env.JWT_SECRET || "your_secret_key";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path)
  const authHeader = request.headers.get("Authorization");
  const authToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : request.cookies.get("daily_scripts.accessToken")?.value;

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
      return NextResponse.next();
    } catch (error) {
      return resetLogin(request);
    }
  }

  return NextResponse.next()
}

function resetLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  response.headers.append(
    "Set-Cookie",
    "daily_scripts.accessToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
  );

  return response;
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