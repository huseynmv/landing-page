"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store";
import LocaleSwitch from "./LocaleSwitch";
import { useDict } from "@/lib/localeContext";

type ServiceItem = { id: number; title: string; slug: string };

const CMS =
    process.env.NEXT_PUBLIC_CMS ??
    "https://romantic-victory-de00aedaff.strapiapp.com";

export default function Navbar() {
    const dict = useDict<any>();
    const locale = useAppSelector(s => s.locale.locale);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const url =
            `${CMS}/api/services` +
            `?fields[0]=title&fields[1]=slug` +
            `&locale=${locale}` +
            `&sort=title:asc`;

        (async () => {
            try {
                const res = await fetch(url, { cache: "no-store" });
                const json = await res.json();
                const items: ServiceItem[] =
                    json?.data?.map((d: any) => ({
                        id: d.id,
                        title: d.title ?? d.attributes?.title,
                        slug: d.slug ?? d.attributes?.slug,
                    })) ?? [];
                setServices(items);
            } catch (e) {
                console.error("Failed to load services", e);
            }
        })();
    }, [locale]);

    const openNow = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const closeSoon = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    };
    const t = {
        home: locale === "ar" ? "الرئيسية" : "Home",
        about: locale === "ar" ? "من نحن" : "About us",
        services: locale === "ar" ? "الخدمات" : "Services",
        blog: locale === "ar" ? "المدونة" : "Blog",
        team: locale === "ar" ? "فريقنا" : "Our Team",
        contact: locale === "ar" ? "اتصل بنا" : "Contact us",
        book: locale === "ar" ? "احجز موعدًا" : "Book Appointment",
        allServices: locale === "ar" ? "جميع الخدمات" : "All Services",
    };

    return (
        <header className={`fixed top-0 inset-x-0 z-50 ${locale === "ar" ? "pl-[124px]" : "pr-[124px]"
            }`}>
            <nav className="px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center">
                    <div className="flex-1" />
                    <ul className="flex items-center gap-8 text-sm text-white/90">
                        <li><Link href={`/${locale}`} className="hover:text-white">{dict.nav.home}</Link></li>
                        <li><Link href={`/${locale}/about`} className="hover:text-white">{dict.nav.about}</Link></li>
                        <li
                            className="relative"
                            onMouseEnter={openNow}
                            onMouseLeave={closeSoon}
                            onFocus={openNow}
                            onBlur={closeSoon}
                        >
                            <Link href={`/${locale}/services`} className="hover:text-white">
                                {dict.nav.services}
                            </Link>
                            {open && (
                                <div
                                    className="
                    fixed left-0 right-0 top-16 z-40
                    bg-[#4B2A1C] text-white
                    px-[115px] py-8
                  "
                                    onMouseEnter={openNow}
                                    onMouseLeave={closeSoon}
                                >

                                    <ul
                                        className="
                      grid gap-x-10 gap-y-3
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                    "
                                    >
                                        {services.length ? (
                                            services.map((s) => (
                                                <li key={s.id}>
                                                    <Link
                                                        href={`/${locale}/services/${s.slug}`}
                                                        className="block rounded-md px-4 py-3 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                                                    >
                                                        {s.title}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="col-span-full text-white/70">Loading…</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li><Link href={`/${locale}/blog`} className="hover:text-white">{dict.nav.blog}</Link></li>
                        <li><Link href={`/${locale}/team`} className="hover:text-white">{dict.nav.team}</Link></li>
                        <li><Link href={`/${locale}/contact`} className="hover:text-white">{dict.nav.contact}</Link></li>
                    </ul>

                    {/* right actions */}
                    <div className="flex-1 flex items-center justify-end gap-[82px]">
                        <button
                            type="button"
                            aria-label="Search"
                            className="text-white/90 hover:text-white grid place-items-center w-8 h-8 rounded-full ring-1 ring-white/40 hover:ring-white transition"
                        >
                            <svg className="rtl-flip" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <Link
                            href={`/${locale}/appointment`}
                            className="text-white/90 hover:text-white rounded-lg px-4 py-2 ring-1 ring-white/60 hover:ring-white transition text-sm"
                        >
                            {dict.nav.book}
                        </Link>
                        <LocaleSwitch />
                    </div>
                </div>
            </nav>
        </header>
    );
}
