"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import LocaleSwitch from "./LocaleSwitch";
import { fetchServicesList } from "@/lib/services";
import type { ServiceItem } from "@/types/service";


export default function Navbar() {
    const router = useRouter();
    const { locale, dict } = useAppSelector((s) => s.locale);

    const [services, setServices] = useState<ServiceItem[]>([]);
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const items = await fetchServicesList(locale);
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

    const toggleSearch = () => {
        setSearchOpen((v) => !v);
        setTimeout(() => inputRef.current?.focus(), 20);
    };
    const submitSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
        setSearchOpen(false);
        setQuery("");
        setMobileOpen(false);
    };
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll(); // initialize
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 ${locale === "ar" ? "pl-4 md:pl-[124px]" : "pr-4 md:pr-[124px]"
                }
      transition-colors duration-300
      ${(scrolled || mobileOpen || open)
                    ? "bg-[#4B2A1C]/90 backdrop-blur supports-[backdrop-filter]:bg-[#4B2A1C]/70 shadow-sm"
                    : "bg-transparent"}
    `}
        >
            <nav className="px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center">
                    <button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Menu"
                        className="md:hidden text-white/90 hover:text-white grid place-items-center w-9 h-9 rounded-md ring-1 ring-white/30"
                    >
                        {!mobileOpen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>

                    <div className="flex-1" />

                    <ul className="hidden md:flex items-center gap-8 text-sm text-white/90">
                        <li>
                            <Link href={`/${locale}`} className="text-white font-[400] text-[14px] leading-[26px]">
                                {dict?.nav.home}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-white font-[400] text-[14px] leading-[26px]">
                                {dict?.nav.about}
                            </Link>
                        </li>

                        <li
                            className="relative"
                            onMouseEnter={openNow}
                            onMouseLeave={closeSoon}
                            onFocus={openNow}
                            onBlur={closeSoon}
                        >
                            <Link href="#" className="text-white font-[400] text-[14px] leading-[26px]">
                                {dict?.nav.services}
                            </Link>

                            {open && (
                                <div
                                    className="fixed left-0 right-0 top-16 z-40 bg-[#4B2A1C] text-white px-[115px] py-8"
                                    onMouseEnter={openNow}
                                    onMouseLeave={closeSoon}
                                >
                                    <ul className="grid gap-x-10 gap-y-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {services.length ? (
                                            services.map((s) => (
                                                <li key={s.id}>
                                                    <Link
                                                        onClick={() => {
                                                            if (closeTimer.current) clearTimeout(closeTimer.current);
                                                            setOpen(false);
                                                            setMobileOpen(false);
                                                            setMobileServicesOpen(false)
                                                        }}
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

                        <li>
                            <Link href="#" className="text-white font-[400] text-[14px] leading-[26px]">
                                {dict?.nav.blog}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-white font-[400] text-[14px] leading-[26px]">
                                {dict?.nav.team}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-white font-[400] text-[14px] leading-[26px]">
                                {dict?.nav.contact}
                            </Link>
                        </li>
                    </ul>

                    <div className="flex-1 flex items-center justify-end gap-3 md:gap-[82px]">
                        <form onSubmit={submitSearch} className="relative items-center gap-2 hidden md:flex">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={locale === "ar" ? "ابحث عن خدمة…" : "Search a service…"}
                                className={`
                  h-8 rounded-md bg-white/15 text-white placeholder-white/70
                  outline-none ring-1 ring-white/30 focus:ring-white
                  px-3 transition-all duration-200 ease-out
                  ${searchOpen ? "w-56 opacity-100" : "w-0 opacity-0 px-0 pointer-events-none"}
                  ${locale === "ar" ? "text-right" : ""}
                `}
                            />
                            <button
                                type={searchOpen ? "submit" : "button"}
                                onClick={!searchOpen ? toggleSearch : undefined}
                                aria-label={dict?.nav.search}
                                className="grid place-items-center w-8 h-8 border-none  ring-white/40 hover:ring-white transition"
                            >
                                <img src="/icons/fa-search.svg" />
                            </button>
                        </form>

                        <Link
                            href="#"
                            className="hover:text-white rounded-lg px-2 py-2 ring-1 ring-white/60 hover:ring-white transition text-white font-[500] text-[12px] leading-[18px] hidden md:inline-block"
                        >
                            {dict?.nav.book}
                        </Link>
                        <LocaleSwitch />
                    </div>
                </div>
            </nav>
            {mobileOpen && (
                <div className="md:hidden fixed left-0 right-0 top-16 z-50 bg-[#4B2A1C] text-white px-5 py-5">
                    <form onSubmit={submitSearch} className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={locale === "ar" ? "ابحث عن خدمة…" : "Search a service…"}
                            className={`flex-1 h-10 rounded-md bg-white/15 text-white placeholder-white/70 outline-none ring-1 ring-white/30 focus:ring-white px-3 ${locale === "ar" ? "text-right" : ""
                                }`}
                        />
                        <button
                            type="submit"
                            className="text-white/90 hover:text-white grid place-items-center w-10 h-10 rounded-md ring-1 ring-white/40 hover:ring-white transition"
                            aria-label={dict?.nav.search}
                        >
                            <svg className="rtl-flip" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </form>

                    <ul className="flex flex-col divide-y divide-white/10 text-sm">
                        <li>
                            <Link href={`/${locale}`} onClick={() => setMobileOpen(false)} className="block py-3">
                                {dict?.nav.home}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" onClick={() => setMobileOpen(false)} className="block py-3">
                                {dict?.nav.about}
                            </Link>
                        </li>

                        <li className="py-2">
                            <button
                                type="button"
                                onClick={() => setMobileServicesOpen((v) => !v)}
                                className="w-full flex items-center justify-between py-1"
                                aria-expanded={mobileServicesOpen}
                            >
                                <span>{dict?.nav.services}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`${mobileServicesOpen ? "rotate-180" : ""} transition`}>
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            {mobileServicesOpen && (
                                <ul className="mt-2 pl-3 space-y-2">
                                    {services.length ? (
                                        services.map((s) => (
                                            <li key={s.id}>
                                                <Link
                                                    href={`/${locale}/services/${s.slug}`}
                                                    onClick={() => {
                                                        if (closeTimer.current) clearTimeout(closeTimer.current);
                                                        setOpen(false);
                                                        setMobileOpen(false);
                                                        setMobileServicesOpen(false);
                                                    }}
                                                    className="block py-2 text-white/90 hover:text-white"
                                                >
                                                    {s.title}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="py-2 text-white/70">Loading…</li>
                                    )}
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link href="#" onClick={() => setMobileOpen(false)} className="block py-3">
                                {dict?.nav.blog}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" onClick={() => setMobileOpen(false)} className="block py-3">
                                {dict?.nav.team}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" onClick={() => setMobileOpen(false)} className="block py-3">
                                {dict?.nav.contact}
                            </Link>
                        </li>
                    </ul>

                    <div className="mt-4">
                        <Link
                            href="#"
                            onClick={() => setMobileOpen(false)}
                            className="inline-block w-full text-center rounded-lg px-4 py-3 ring-1 ring-white/60 hover:ring-white transition"
                        >
                            {dict?.nav.book}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
