import { NextResponse } from "next/server";

export async function middleware(req) {
  // Call your /api/auth/me route and forward cookies
  const res = await fetch(new URL("/api/auth/me", req.url).toString(), {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const data = await res.json();

  if (!data.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Protect all /dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
