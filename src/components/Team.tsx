"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { fetchTeamMembers } from "@/lib/services";
import type { TeamMember } from "@/types/team";

export default function Team() {
    const { locale, dict } = useAppSelector((s) => s.locale);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(3);
    const isRTL = locale === "ar";

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
        (async () => {
            let list = await fetchTeamMembers(locale);
            if (!list.length && locale === "ar") list = await fetchTeamMembers("en");
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
    const offsetPct = isRTL ? translatePct : -translatePct;

    if (!members.length) return null;

    return (
        <section className="relative bg-[#F3F3F3] pt-[80px] pb-[72px] px-6 sm:px-8 lg:pt-[126px] lg:pb-[92px] lg:px-[115px]">
            <p className="text-center font-[700] text-[#4B2615] text-[28px] sm:text-[34px] lg:text-[42px]">
                {dict?.sections?.teamTitle}
            </p>
            <p className="mt-[14px] sm:mt-[16px] lg:mt-[20px] text-center font-[500] text-[#1E1E1E] text-[15px] sm:text-[16px] lg:text-[18px] px-2 sm:px-8 lg:px-0">
                {locale === "ar"
                    ? "نص تجريبي يستخدم في الطباعة والتنضيد منذ القرن السادس عشر."
                    : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                <br />
                {locale === "ar"
                    ? "وقد كان النص القياسي للصناعة منذ القرن السادس عشر."
                    : "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}
            </p>

            <div className="relative overflow-hidden pt-8 lg:pt-[74px]">
                <button
                    onClick={prev}
                    aria-label="Previous"
                    className={`absolute ${isRTL ? "rtl-flip" : ""} left-2 z-99 sm:left-0 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full transition ${canPrev ? "hover:bg-black/5" : "opacity-40 pointer-events-none"
                        }`}
                >
                    <img className="rtl-flip" src="/icons/left-dark.svg" />
                </button>
                <div className="mx-2 sm:mx-8 md:mx-12 lg:mx-[138px] overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(${offsetPct}%)` }}
                    >
                        {members.map((m) => (
                            <div
                                key={m.id}
                                className="shrink-0"
                                style={{ flexBasis: `${100 / visible}%` }}
                            >
                                <div className="px-2 sm:px-3 lg:px-4">
                                    <article className="text-center">
                                        <div className="relative mx-auto w-full h-[180px] sm:h-[200px] lg:h-[220px] bg-[#5A3A2B] overflow-hidden">
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

                                        <h3 className="mt-3 sm:mt-4 text-[18px] sm:text-[20px] lg:text-[22px] font-[500] text-[#4B2615]">
                                            {m.name ?? "Name Here"}
                                        </h3>

                                        <div className="mt-1 text-[12px] sm:text-[13px] lg:text-[14px] tracking-[0.12em] uppercase text-[#15143966] font-[700]">
                                            {m.position ?? "Position here"}
                                        </div>

                                        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-4 sm:gap-5 text-[#111]">
                                            {m.whatsapp ? (
                                                <Link
                                                    href={`https://wa.me/${cleanPhone(m.whatsapp)}`}
                                                    aria-label="WhatsApp"
                                                    className="hover:opacity-70"
                                                >
                                                    <img src="/icons/fa-whatsapp.svg" />
                                                </Link>
                                            ) : (
                                                <span className="opacity-40">
                                                    <img src="/icons/fa-whatsapp.svg" />
                                                </span>
                                            )}

                                            {m.phone ? (
                                                <Link
                                                    href={`tel:${cleanPhone(m.phone)}`}
                                                    aria-label="Call"
                                                    className="hover:opacity-70"
                                                >
                                                    <img src="/icons/fa-phone.svg" />
                                                </Link>
                                            ) : (
                                                <span className="opacity-40">
                                                    <img src="/icons/fa-phone.svg" />
                                                </span>
                                            )}

                                            {m.email ? (
                                                <Link
                                                    href={`mailto:${m.email}`}
                                                    aria-label="Email"
                                                    className="hover:opacity-70"
                                                >
                                                    <img src="/icons/fa-mail.svg" />
                                                </Link>
                                            ) : (
                                                <img src="/icons/fa-mail.svg" />
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
                    className={`absolute ${isRTL ? "rtl-flip" : ""} right-2 sm:right-0 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full transition ${canNext ? "hover:bg-black/5" : "opacity-40 pointer-events-none"
                        }`}
                >
                    <img src="/icons/right-dark.svg" className="rtl-flip" />
                </button>
            </div>
        </section>
    );
}

function cleanPhone(s: string) {
    return (s || "").replace(/[^\d+]/g, "");
}
