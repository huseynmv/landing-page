"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/store";
import { fetchTestimonials } from "@/lib/services";
import type { Testimonial } from "@/types/testimonial";

export default function Testimonials() {
    const { locale, dict } = useAppSelector((s) => s.locale);
    const isRTL = locale === "ar";
    const [items, setItems] = useState<Testimonial[]>([]);
    const [i, setI] = useState(0);

    useEffect(() => {
        (async () => {
            let list = await fetchTestimonials(locale);
            if (!list.length && locale === "ar") {
                list = await fetchTestimonials("en");
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
        <section className="bg-[#4B2615] text-white pt-[70px] pb-[60px] px-6 sm:px-8 lg:pt-[100px] lg:pb-[80px] lg:px-[122px]">
            <div className="max-w-5xl">
                <h2 className="text-white text-[28px] sm:text-[34px] lg:text-[40px] font-[700]">
                    {t.title ?? (locale === "ar" ? "آراء عملائنا" : "What our clients are saying")}
                </h2>
                {t.subTitle && (
                    <p className="mt-3 sm:mt-4 text-white/70 text-[16px] sm:text-[17px] lg:text-[18px] font-[400] leading-relaxed">
                        {t.subTitle}
                    </p>
                )}
            </div>

            <div className="relative mt-8 lg:mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-[374px_minmax(0,1fr)] gap-y-6 sm:gap-y-8 lg:gap-y-0 lg:gap-x-[49px] items-start">
                    <div className="mx-auto lg:mx-0 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[374px] lg:h-[374px] bg-[#6A4433] overflow-hidden">
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
                            <p className="text-[18px] sm:text-[20px] lg:text-[24px] font-[400] leading-8 text-white/70 whitespace-pre-line">
                                {t.description}
                            </p>
                        )}

                        <div className="mt-6 lg:mt-8">
                            {t.name && <div className="text-[18px] sm:text-[20px] lg:text-[24px] font-[600]">{t.name}</div>}
                            {t.position && (
                                <div className="text-white/70 text-[14px] sm:text-[15px] lg:text-[16px] font-[400]">
                                    {t.position}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-[18px] sm:mt-[20px] lg:mt-[22px] flex justify-center lg:justify-end gap-3 sm:gap-4">
                    {
                        isRTL ? <>
                            <button
                                onClick={next}
                                disabled={!canNext}
                                aria-label="Next testimonial"
                                className={`w-10  ${isRTL ? "rtl-flip" : ""} h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center transition ${canNext ? "bg-white hover:bg-white/90" : "bg-white/80 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronRight className="text-[#4B2A1C] rtl-flip" />
                            </button>
                            <button
                                onClick={prev}
                                disabled={!canPrev}
                                aria-label="Previous testimonial"
                                className={`w-10  ${isRTL ? "rtl-flip" : ""} h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center transition ${canPrev ? "bg-white/15 hover:bg-white/25" : "bg-white/10 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft className="text-white rtl-flip" />
                            </button>


                        </> : <>
                            <button
                                onClick={prev}
                                disabled={!canPrev}
                                aria-label="Previous testimonial"
                                className={`w-10  ${isRTL ? "rtl-flip" : ""} h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center transition ${canPrev ? "bg-white/15 hover:bg-white/25" : "bg-white/10 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft className="text-white rtl-flip" />
                            </button>
                            <button
                                onClick={next}
                                disabled={!canNext}
                                aria-label="Next testimonial"
                                className={`w-10  ${isRTL ? "rtl-flip" : ""} h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center transition ${canNext ? "bg-white hover:bg-white/90" : "bg-white/80 opacity-60 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronRight className="text-[#4B2A1C] rtl-flip" />
                            </button>



                        </>
                    }
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
