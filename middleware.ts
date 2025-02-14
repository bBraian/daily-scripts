import { NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/in-development', whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path)
  const authToken = request.cookies.get('token')

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
    //check JWT not expired

    return NextResponse.next()
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