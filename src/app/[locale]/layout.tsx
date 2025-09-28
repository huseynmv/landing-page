import Navbar from "@/components/Navbar";
import "../globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import { setLocale, setDict, type Locale } from "@/store/localeSlice";
import Footer from "@/components/Footer";
import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-dm-sans",
    weight: ["400", "500", "600", "700"],
});

async function loadDict(locale: Locale) {
    if (locale === "ar") {
        return (await import("@/internationalization/ar.json")).default;
    }
    return (await import("@/internationalization/en.json")).default;
}

export function generateStaticParams() {
    return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const dict = await loadDict(locale);
    const dir = locale === "ar" ? "rtl" : "ltr";

    const initialState = {
        locale: { locale, dict },
    };

    return (
        <html lang={locale} dir={dir}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
                />
            </head>
            <body className={`${dmSans.variable} antialiased`}>
                <ReduxProvider initialState={initialState}>
                    <Navbar />
                    {children}
                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
