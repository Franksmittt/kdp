import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_SITE = "https://www.krugersdorppainting.co.za";

function apexHost(hostname: string) {
  return hostname.replace(/^www\./i, "");
}

export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

  let canonical: URL;
  try {
    canonical = new URL(
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? DEFAULT_SITE,
    );
  } catch {
    return NextResponse.next();
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (!host) return NextResponse.next();

  const canonicalHost = canonical.hostname.toLowerCase();
  if (host === canonicalHost) return NextResponse.next();

  if (apexHost(host) !== apexHost(canonicalHost)) {
    return NextResponse.next();
  }

  const dest = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    canonical.origin,
  );
  return NextResponse.redirect(dest, 308);
}

export const config = {
  matcher: [
    /*
     * Run only on likely document navigations; skip static assets and Next internals.
     */
    "/((?!_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|images/|css/|webfonts/|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
};
