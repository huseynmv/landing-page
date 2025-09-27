// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//     const defaultLocale = 'en'; // Your default locale

//     // If the pathname starts with the default locale prefix, redirect to the unprefixed version
//     if (pathname.startsWith(`/${defaultLocale}/`)) {
//         const newPath = pathname.replace(`/${defaultLocale}`, '');
//         return NextResponse.redirect(new URL(newPath || '/', request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Apply middleware to all paths except API routes, static files, and favicon
// };