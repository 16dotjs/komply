import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Replaces the `if (!session) window.location.href = "index.html"` guard
 * that was copy-pasted at the top of every portal/admin page's init().
 *
 * SECURITY NOTE — carried over from the original app, not fixed here:
 * portal and admin sign-in both use the same Supabase Auth user pool with no
 * `role` column. The only thing currently separating an admin from a client
 * is the URL path. Before launch, add a `role` (or a dedicated `admins`
 * table keyed by user_id, mirroring how `clients` is keyed by email) and
 * check it here for the /admin branch — the same way the portal already
 * checks for a matching `clients` row before allowing sign-in.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isPortalRoute = pathname.startsWith("/portal");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalLogin = pathname === "/portal/login";
  const isAdminLogin = pathname === "/admin/login";

  if (!user && isPortalRoute && !isPortalLogin) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  if (!user && isAdminRoute && !isAdminLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Already signed in — bounce away from the login screen, mirroring the
  // old checkSession() that ran on index.html load.
  if (user && isPortalLogin) {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }
  if (user && isAdminLogin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
