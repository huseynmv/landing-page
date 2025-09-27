"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Testimonial = {
    id: number;
    title: string | null;
    subTitle: string | null;
    description: string | null;
    name: string | null;
    position: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
};

const CMS =
    process.env.NEXT_PUBLIC_CMS ?? "https://romantic-victory-de00aedaff.strapiapp.com";

export default function Testimonials() {
    const { locale } = useParams() as { locale: "en" | "ar" };
    const [items, setItems] = useState<Testimonial[]>([]);
    const [i, setI] = useState(0);

    useEffect(() => {
        async function load(localeToUse: "en" | "ar") {
            const url =
                `${CMS}/api/testimonials` +
                `?fields[0]=title&fields[1]=subTitle&fields[2]=description&fields[3]=name&fields[4]=position` +
                `&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText` +
                `&sort=createdAt:desc` +
                `&locale=${localeToUse}`;

            const res = await fetch(url, { cache: "no-store" });
            const json = await res.json();
            const list: Testimonial[] =
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
                        title: d.title ?? d.attributes?.title ?? null,
                        subTitle: d.subTitle ?? d.attributes?.subTitle ?? null,
                        description: d.description ?? d.attributes?.description ?? null,
                        name: d.name ?? d.attributes?.name ?? null,
                        position: d.position ?? d.attributes?.position ?? null,
                        imageUrl: img ? (img.startsWith("http") ? img : `${CMS}${img}`) : null,
                        imageAlt: alt ?? null,
                    };
                }) ?? [];

            return list;
        }

        (async () => {
            let list = await load(locale);
            if (!list.length && locale === "ar") {
                list = await load("en");
            }
            setItems(list);
            setI(0);
        })();
    }, [locale]);

    if (!items.length) return null;

    const canPrev = i > 0;
    const canNext = i < items.length - 1;

    const prev = () => canPrev && setI((x) => x - 1);
    const next = () => canNext && setI((x) => x + 1);

    const t = items[i];

    return (
        <section className="bg-[#4B2615] text-white pt-[100px] pb-[80px] px-[122px]">
            <div className="max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-semibold">
                    {t.title ?? (locale === "ar" ? "آراء عملائنا" : "What our clients are saying")}
                </h2>
                {t.subTitle && (
                    <p className="mt-4 text-white/85 leading-relaxed">{t.subTitle}</p>
                )}
            </div>

            <div className="relative mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-[374px_minmax(0,1fr)] gap-y-8 lg:gap-y-0 lg:gap-x-[49px] items-start">
                    <div className="w-[374px] h-[374px] bg-[#6A4433] overflow-hidden">
                        {t.imageUrl && (
                            <Image
                                src={t.imageUrl}
                                alt={t.imageAlt ?? t.name ?? "Client"}
                                width={374}
                                height={374}
                                className="w-full h-full object-cover"
                                priority
                            />
                        )}
                    </div>

                    <div className="max-w-[640px] flex flex-col h-full justify-between">
                        {t.description && (
                            <p className="text-lg md:text-[20px] leading-8 text-white/90 whitespace-pre-line">
                                {t.description}
                            </p>
                        )}

                        <div className="mt-8">
                            {t.name && <div className="font-semibold text-lg">{t.name}</div>}
                            {t.position && (
                                <div className="text-white/70 text-sm">{t.position}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-[22px] flex justify-end gap-4">
                    <button
                        onClick={prev}
                        disabled={!canPrev}
                        aria-label="Previous testimonial"
                        className={`w-11 h-11 rounded-full grid place-items-center transition ${canPrev ? "bg-white/15 hover:bg-white/25" : "bg-white/10 opacity-60 cursor-not-allowed"
                            }`}
                    >
                        <ChevronLeft className="text-white rtl-flip" />
                    </button>

                    <button
                        onClick={next}
                        disabled={!canNext}
                        aria-label="Next testimonial"
                        className={`w-11 h-11 rounded-full grid place-items-center transition ${canNext ? "bg-white hover:bg-white/90" : "bg-white/80 opacity-60 cursor-not-allowed"
                            }`}
                    >
                        <ChevronRight className="text-[#4B2A1C] rtl-flip" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
