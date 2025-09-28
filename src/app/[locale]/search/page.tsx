"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import heroImg from "@/assets/heroImg.jpg";
import Image from "next/image";

type ServiceItem = { id: number; title: string; slug: string; description?: string | null };
type TeamItem = { id: number; name: string; position?: string | null };

const CMS = process.env.NEXT_PUBLIC_CMS
type TabKey = "team" | "services";
const PAGE_SIZE = 8;


type PageToken = number | "…";

function buildPageWindow(current: number, total: number): PageToken[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: PageToken[] = [];
    const push = (v: PageToken) => pages[pages.length - 1] !== v && pages.push(v);

    push(1);
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) push("…");
    for (let p = start; p <= end; p++) push(p);
    if (end < total - 1) push("…");
    push(total);
    return pages;
}

function Pagination({
    dir,
    current,
    total,
    onPage,
}: {
    dir: "ltr" | "rtl";
    current: number;
    total: number;
    onPage: (p: number) => void;
}) {
    if (total <= 1) return null;
    const items = buildPageWindow(current, total);
    const isRTL = dir === "rtl";

    return (
        <nav className="mt-8 flex items-center justify-end gap-4 select-none">
            {/* Prev */}
            <button
                onClick={() => current > 1 && onPage(current - 1)}
                className={`p-2 text-[#2e2e2e] disabled:opacity-40 ${current === 1 ? "cursor-not-allowed" : "hover:opacity-70"}`}
                disabled={current === 1}
                aria-label="Prev"
            >

                <svg className={isRTL ? "" : "rotate-180"} width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* pages */}
            <ul className="flex items-center gap-6">
                {items.map((it, i) =>
                    it === "…" ? (
                        <li
                            key={`e-${i}`}
                            className="w-10 h-10 grid place-items-center rounded-lg border border-black/70 text-[#2e2e2e]"
                            aria-hidden
                        >
                            …
                        </li>
                    ) : (
                        <li key={it}>
                            <button
                                onClick={() => onPage(it)}
                                className={`text-lg text-[#2e2e2e] hover:opacity-80 ${it === current ? "relative pb-1 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[4px] after:w-8 after:rounded-full after:bg-[#4B2A1C]" : ""
                                    }`}
                            >
                                {it}
                            </button>
                        </li>
                    )
                )}
            </ul>

            {/* Next */}
            <button
                onClick={() => current < total && onPage(current + 1)}
                className={`p-2 text-[#2e2e2e] disabled:opacity-40 ${current === total ? "cursor-not-allowed" : "hover:opacity-70"}`}
                disabled={current === total}
                aria-label="Next"
            >
                <svg className={isRTL ? "" : "rotate-180"} width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </nav>
    );
}

export default function SearchPage() {
    const { locale } = useParams() as { locale: "en" | "ar" };
    const router = useRouter();
    const sp = useSearchParams();
    const q = (sp.get("q") || "").trim();

    const [active, setActive] = useState<TabKey>("team");
    const [loading, setLoading] = useState(false);

    const [team, setTeam] = useState<TeamItem[]>([]);
    const [services, setServices] = useState<ServiceItem[]>([]);

    const [teamPage, setTeamPage] = useState(1);
    const [teamTotalPages, setTeamTotalPages] = useState(1);
    const [svcPage, setSvcPage] = useState(1);
    const [svcTotalPages, setSvcTotalPages] = useState(1);

    useEffect(() => {
        setTeamPage(1);
        setSvcPage(1);
    }, [q, locale, active]);

    useEffect(() => {
        if (!q) {
            setTeam([]);
            setServices([]);
            setTeamTotalPages(1);
            setSvcTotalPages(1);
            return;
        }
        setLoading(true);

        const servicesUrl =
            `${CMS}/api/services` +
            `?fields[0]=title&fields[1]=slug&fields[2]=description` +
            `&filters[title][$containsi]=${encodeURIComponent(q)}` +
            `&locale=${locale}` +
            `&sort=title:asc` +
            `&pagination[page]=${svcPage}&pagination[pageSize]=${PAGE_SIZE}`;

        const teamUrl =
            `${CMS}/api/teams` +
            `?fields[0]=name&fields[1]=position` +
            `&filters[$or][0][name][$containsi]=${encodeURIComponent(q)}` +
            `&filters[$or][1][position][$containsi]=${encodeURIComponent(q)}` +
            `&locale=${locale}` +
            `&sort=name:asc` +
            `&pagination[page]=${teamPage}&pagination[pageSize]=${PAGE_SIZE}`;

        (async () => {
            try {
                const [sr, tr] = await Promise.all([
                    fetch(servicesUrl, { cache: "no-store" }),
                    fetch(teamUrl, { cache: "no-store" }),
                ]);
                const sjson = await sr.json();
                const tjson = await tr.json();

                const sItems: ServiceItem[] =
                    sjson?.data?.map((d: any) => ({
                        id: d.id,
                        title: d.title ?? d.attributes?.title,
                        slug: d.slug ?? d.attributes?.slug,
                        description: d.description ?? d.attributes?.description ?? null,
                    })) ?? [];

                const tItems: TeamItem[] =
                    tjson?.data?.map((d: any) => ({
                        id: d.id,
                        name: d.name ?? d.attributes?.name,
                        position: d.position ?? d.attributes?.position ?? null,
                    })) ?? [];

                setServices(sItems);
                setTeam(tItems);

                const sMeta = sjson?.meta?.pagination;
                const tMeta = tjson?.meta?.pagination;
                if (sMeta?.pageCount) setSvcTotalPages(Number(sMeta.pageCount));
                if (tMeta?.pageCount) setTeamTotalPages(Number(tMeta.pageCount));
            } catch (e) {
                console.error("search failed", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [q, locale, teamPage, svcPage]);

    const [input, setInput] = useState(q);
    useEffect(() => setInput(q), [q]);

    const L = useMemo(
        () =>
            locale === "ar"
                ? {
                    back: "رجوع",
                    title: "نتائج البحث",
                    team: "الفريق",
                    services: "الخدمات",
                    readMore: "اقرأ المزيد",
                    empty: "لا توجد نتائج.",
                    hint: "أدخل كلمة البحث لعرض النتائج.",
                    placeholder: "ابحث…",
                }
                : {
                    back: "Back",
                    title: "Search Results",
                    team: "Team",
                    services: "Services",
                    readMore: "Read more",
                    empty: "No results.",
                    hint: "Enter a query to see results.",
                    placeholder: "Search…",
                },
        [locale]
    );

    const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";
    const textDir = locale === "ar" ? "text-right" : "text-left";

    return (
        <main dir={dir} className="min-h-screen bg-white text-[#2E2E2E]">
            <section className="relative h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden">
                <Image src={heroImg} alt="" fill priority className="object-cover saturate-0" />
                <div className="absolute inset-0 bg-[linear-gradient(271.47deg,rgba(75,38,21,0.28)_1.2%,rgba(75,38,21,0.68)_86.38%)]" />
                <div className="absolute inset-x-0 bottom-6 md:bottom-10 lg:bottom-16 px-6 md:px-10 lg:px-[115px]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    </div>
                </div>
            </section>
            <div className="pt-10 md:pt-16 pb-16 px-6 md:px-10 lg:px-[115px]">
                {!q && <p className="text-black/60 text-sm md:text-base">{L.hint}</p>}

                {q && (
                    <div className="grid grid-cols-12 gap-6 md:gap-8">
                        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
                            <div className={`rounded-md bg-[#F7F6F5] p-3 md:p-6 ${textDir}`}>
                                <div className="flex md:block gap-3">
                                    <button
                                        onClick={() => setActive("team")}
                                        className={`w-full md:w-auto md:block text-left rounded-md px-3 py-2 text-sm md:text-base font-medium transition ${active === "team" ? "bg-white text-[#4B2A1C]" : "text-black/70 hover:text-black"
                                            }`}
                                    >
                                        {L.team}
                                    </button>
                                    <button
                                        onClick={() => setActive("services")}
                                        className={`w-full md:w-auto md:block text-left rounded-md px-3 py-2 text-sm md:text-base font-medium transition md:mt-3 ${active === "services" ? "bg-white text-[#4B2A1C]" : "text-black/70 hover:text-black"
                                            }`}
                                    >
                                        {L.services}
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <section className="col-span-12 md:col-span-8 lg:col-span-9">

                            <button
                                onClick={() => router.back()}
                                aria-label="Previous testimonial"
                                className={`w-10  ${locale === 'ar' ? "rtl-flip" : ""} inline-flex items-center gap-2 text-[#4B2615] hover:opacity-90 text-sm md:text-base w-fit`}
                            >
                                <ChevronLeft className="text-black rtl-flip" />
                                {L.back}
                            </button>
                            {loading ? (
                                <p className="text-black/60 text-sm md:text-base">Loading…</p>
                            ) : active === "team" ? (
                                <>

                                    <ResultList
                                        locale={locale}
                                        items={team.map((t) => ({
                                            id: t.id,
                                            title: t.name,
                                            sub: t.position || "",
                                            href: `/${locale}/team`,
                                            readMore: L.readMore,
                                        }))}
                                        emptyText={L.empty}
                                    />
                                    <Pagination
                                        dir={dir}
                                        current={teamPage}
                                        total={teamTotalPages}
                                        onPage={(p) => setTeamPage(p)}
                                    />
                                </>
                            ) : (
                                <>
                                    <ResultList
                                        locale={locale}
                                        items={services.map((s) => ({
                                            id: s.id,
                                            title: s.title,
                                            sub: s.description ?? "",
                                            href: `/${locale}/services/${s.slug}`,
                                            readMore: L.readMore,
                                        }))}
                                        emptyText={L.empty}
                                    />
                                    <Pagination
                                        dir={dir}
                                        current={svcPage}
                                        total={svcTotalPages}
                                        onPage={(p) => setSvcPage(p)}
                                    />
                                </>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}

function ResultList({
    locale,
    items,
    emptyText,
}: {
    locale: "en" | "ar";
    items: { id: number; title: string; sub?: string; href: string; readMore: string }[];
    emptyText: string;
}) {
    const textDir = locale === "ar" ? "text-right" : "text-left";
    if (!items.length) return <p className="text-black/60 text-sm md:text-base">{emptyText}</p>;

    return (
        <ul className={`divide-y divide-black/10 ${textDir}`}>
            {items.map((it, idx) => (
                <li key={it.id} className="py-5 md:py-6">
                    <div className="text-base md:text-lg text-[#4B2A1C] font-medium mb-2 break-words">{it.title}</div>
                    {it.sub ? <p className="text-sm md:text-base text-black/70 leading-relaxed break-words">{it.sub}</p> : null}
                    <div className="mt-3">
                        <Link href={it.href} className="text-[#4B2A1C] underline hover:opacity-80 text-sm md:text-base">
                            {it.readMore}
                        </Link>
                    </div>
                    {idx !== items.length - 1 && <div className="mt-5 md:mt-6 h-px bg-black/10" />}
                </li>
            ))}
        </ul>
    );
}
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}