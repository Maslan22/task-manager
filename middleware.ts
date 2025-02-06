// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "./app/utils/auth";

export async function middleware(request: Request) {
  const session = await auth();
  
  // Get the pathname of the request
  const path = new URL(request.url).pathname;

  // If user is admin and goes to dashboard, redirect to admin panel
  if (session?.user?.role === "ADMIN" && path === '/dashboard') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Admin routes - only allow access if user is admin
  if (path.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protected routes - if no session exists, redirect to login
  if (!session?.user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Auth routes - if session exists, redirect to appropriate dashboard
  if (session?.user && (path === '/login' || path === '/register')) {
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register']
}