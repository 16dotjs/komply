import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Replaces the `if (!session) window.location.href = "index.html"` guard
 * that was copy-pasted at the top of every portal/admin page's init().
 *
 * Also enforces role separation: portal and admin sign-in share the same
 * Supabase Auth user pool, so a valid session alone doesn't say which side
 * someone belongs to. This checks the `admins` / `clients` tables below —
 * see supabase/migrations/001_add_admins_table.sql for the schema.
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
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
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
  // The recovery link's token lives in the URL hash, which never reaches
  // the server — so at the point middleware runs, there's genuinely no
  // session yet even for a valid link. The page itself waits for the
  // client-side token exchange before showing the form.
  const isAdminResetPassword = pathname === "/admin/reset-password";

  // No session at all — only the respective login/reset pages are reachable.
  if (!user) {
    if (isPortalRoute && !isPortalLogin) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
    if (isAdminRoute && !isAdminLogin && !isAdminResetPassword) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  // Signed in — enforce that the session actually belongs to an admin
  // (checked against the `admins` table) or a client (checked against
  // `clients`), not just that *some* Supabase Auth session exists. This
  // is what actually separates the two sides — the URL path alone never
  // proved anything.
  if (isAdminRoute && !isAdminResetPassword) {
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (admin && isAdminLogin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (!admin && !isAdminLogin) {
      // Signed in, but not an admin (e.g. a client session) — bounce to
      // admin login rather than granting access on path alone.
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isPortalRoute) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (client && isPortalLogin) {
      return NextResponse.redirect(new URL("/portal/dashboard", request.url));
    }
    if (!client && !isPortalLogin) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
