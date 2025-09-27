"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDict } from "@/lib/localeContext";

type TeamMember = {
    id: number;
    name: string;
    position?: string | null;
    whatsapp?: string | null;
    phone?: string | null;
    email?: string | null;
    imageUrl?: string | null;
    imageAlt?: string | null;
};

const CMS =
    process.env.NEXT_PUBLIC_CMS ??
    "https://romantic-victory-de00aedaff.strapiapp.com";

export default function Team() {
    const dict = useDict<any>();
    const { locale } = useParams() as { locale: "en" | "ar" };
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(3);

    useEffect(() => {
        const compute = () => {
            const w = window.innerWidth;
            if (w >= 1024) setVisible(3);
            else if (w >= 640) setVisible(2);
            else setVisible(1);
        };
        compute();
        window.addEventListener("resize", compute);
        return () => window.removeEventListener("resize", compute);
    }, []);

    useEffect(() => {
        async function load(loc: "en" | "ar") {
            const url =
                `${CMS}/api/teams` +
                `?fields[0]=name&fields[1]=position&fields[2]=whatsapp&fields[3]=phone&fields[4]=email` +
                `&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText` +
                `&sort=createdAt:desc` +
                `&locale=${loc}`;
            const res = await fetch(url, { cache: "no-store" });
            const json = await res.json();
            const list: TeamMember[] =
                json?.data?.map((d: any) => {
                    const img =
                        d?.image?.url ??
                        d?.attributes?.image?.data?.attributes?.url ??
                        d?.attributes?.image?.url ??
                        null;
                    const alt =
                        d?.image?.alternativeText ??
                        d?.attributes?.image?.data?.attributes?.alternativeText ??
                        null;

                    return {
                        id: d.id,
                        name: d.name ?? d.attributes?.name,
                        position: d.position ?? d.attributes?.position ?? null,
                        whatsapp: d.whatsapp ?? d.attributes?.whatsapp ?? null,
                        phone: d.phone ?? d.attributes?.phone ?? null,
                        email: d.email ?? d.attributes?.email ?? null,
                        imageUrl: img ? (img.startsWith("http") ? img : `${CMS}${img}`) : null,
                        imageAlt: alt,
                    };
                }) ?? [];
            return list;
        }

        (async () => {
            let list = await load(locale);
            if (!list.length && locale === "ar") {
                list = await load("en");
            }
            setMembers(list);
            setIndex(0);
        })();
    }, [locale]);

    useEffect(() => {
        const max = Math.max(0, members.length - visible);
        setIndex((i) => Math.min(i, max));
    }, [members.length, visible]);

    const canPrev = index > 0;
    const canNext = index < Math.max(0, members.length - visible);

    const prev = () => canPrev && setIndex((i) => i - 1);
    const next = () => canNext && setIndex((i) => i + 1);

    const translatePct = (100 / visible) * index;

    if (!members.length) return null;

    return (
        <section className="relative bg-[#F3F3F3] pt-[126px] pb-[92px] px-[115px]">
            <p className="text-center">
                {dict.sections.teamTitle}
            </p>
            <p className="mt-[20px] text-center">
                {locale === "ar"
                    ? "نص تجريبي يستخدم في الطباعة والتنضيد منذ القرن السادس عشر."
                    : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                <br />
                {locale === "ar"
                    ? "وقد كان النص القياسي للصناعة منذ القرن السادس عشر."
                    : "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}
            </p>
            <div className="relative overflow-hidden pt-[74px]">
                <button
                    onClick={prev}
                    aria-label="Previous"
                    className={`absolute left-0 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full transition ${canPrev ? "hover:bg-black/5" : "opacity-40 pointer-events-none"
                        }`}
                >
                    <ChevronLeft className="rtl-flip" />
                </button>
                <div className="mx-[138px] overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${translatePct}%)` }}
                    >
                        {members.map((m) => (
                            <div
                                key={m.id}
                                className="shrink-0"
                                style={{ flexBasis: `${100 / visible}%` }}
                            >
                                <div className="px-4">
                                    <article className="text-center">
                                        <div className="relative mx-auto w-full h-[220px] bg-[#5A3A2B] overflow-hidden">
                                            {m.imageUrl ? (
                                                <Image
                                                    src={m.imageUrl}
                                                    alt={m.imageAlt ?? m.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            ) : null}
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-[#2E2E2E]">
                                            {m.name ?? "Name Here"}
                                        </h3>
                                        <div className="mt-1 text-xs tracking-[0.12em] uppercase text-[#A9A9B2]">
                                            {m.position ?? "Position here"}
                                        </div>
                                        <div className="mt-4 flex items-center justify-center gap-5 text-[#111]">
                                            {m.whatsapp ? (
                                                <Link
                                                    href={`https://wa.me/${cleanPhone(m.whatsapp)}`}
                                                    aria-label="WhatsApp"
                                                    className="hover:opacity-70"
                                                >
                                                    <WhatsAppIcon />
                                                </Link>
                                            ) : (
                                                <span className="opacity-40">
                                                    <WhatsAppIcon />
                                                </span>
                                            )}

                                            {m.phone ? (
                                                <Link
                                                    href={`tel:${cleanPhone(m.phone)}`}
                                                    aria-label="Call"
                                                    className="hover:opacity-70"
                                                >
                                                    <p>phone</p>
                                                </Link>
                                            ) : (
                                                <span className="opacity-40">
                                                    <p>phone</p>
                                                </span>
                                            )}

                                            {m.email ? (
                                                <Link
                                                    href={`mailto:${m.email}`}
                                                    aria-label="Email"
                                                    className="hover:opacity-70"
                                                >
                                                    <MailIcon />
                                                </Link>
                                            ) : (
                                                <span className="opacity-40">
                                                    <MailIcon />
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={next}
                    aria-label="Next"
                    className={`absolute right-0 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full transition ${canNext ? "hover:bg-black/5" : "opacity-40 pointer-events-none"
                        }`}
                >
                    <ChevronRight className="rtl-flip" />
                </button>
            </div>
        </section>
    );
}

function cleanPhone(s: string) {
    return (s || "").replace(/[^\d+]/g, "");
}
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function WhatsAppIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12.04 2C6.57 2 2.14 6.43 2.14 11.9c0 1.88.49 3.65 1.35 5.18L2 22l4.08-1.44c1.47.8 3.16 1.25 4.96 1.25 5.47 0 9.9-4.43 9.9-9.9S17.51 2 12.04 2Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16.73 14.68c-.25.71-1.45 1.34-1.99 1.39-.54.05-1.23.08-2.08-.32-.85-.39-2.8-1.29-3.99-3.09-1.47-2.15-1.6-3.6-1.58-4.06.02-.46.25-1.16.79-1.55.54-.39.86-.37 1.15-.32.29.05.9.37 1.03 1.43.13 1.06.42 1.64.54 1.84.12.2.19.43.04.69-.15.26-.23.42-.45.65-.22.23-.47.5-.2.95.27.45 1.19 1.95 2.74 2.64 1.55.69 1.79.42 2.22.14.43-.28.7-.61.9-.51.2.1 1.28.6 1.28 1.22Z" fill="currentColor" />
        </svg>
    );
}
function MailIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 7l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}
