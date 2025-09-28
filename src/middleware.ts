import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "ar"] as const;
type Locale = typeof LOCALES[number];

function detectLocale(req: NextRequest): Locale {

    const cookieLocale = req.cookies.get("locale")?.value;
    if (cookieLocale && LOCALES.includes(cookieLocale as Locale)) {
        return cookieLocale as Locale;
    }

    const header = req.headers.get("accept-language") || "";
    const firstLang = header.split(",")[0]?.trim().toLowerCase();
    if (firstLang?.startsWith("ar")) return "ar";

    return "en";
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.match(/\.[\w]+$/)
    ) {
        return NextResponse.next();
    }
    const pathLocale = pathname.split("/")[1];
    if (LOCALES.includes(pathLocale as Locale)) {
        return NextResponse.next();
    }
    const locale = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/((?!_next|.*\\..*|api).*)"],
};
