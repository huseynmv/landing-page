import Navbar from "@/components/Navbar";
import "../globals.css";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import ReduxProvider from "@/store/ReduxProvider";
import { Locale } from "@/store/localeSlice";
import { getDictionary } from "@/lib/getLocale";
import { DictProvider } from "@/lib/localeContext";

export function generateStaticParams() {
    return [{ locale: "en" }, { locale: "ar" }];
}


export default async function RootLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return (
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="h-full">
            <body className="min-h-screen flex flex-col">
                <ReduxProvider initialLocale={locale}>
                    <DictProvider locale={dict}>
                        <Navbar />
                        <main className="flex-1 pt-16">
                            {children}
                        </main>
                        <Footer />
                    </DictProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
