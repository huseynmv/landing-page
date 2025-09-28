"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { fetchSliders } from "@/lib/services";
import type { Slide } from "@/types/slider";

export default function HeroSlider() {
    const { locale } = useAppSelector((s) => s.locale);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [current, setCurrent] = useState(0);
    const [isAuto, setIsAuto] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const list = await fetchSliders(locale);
                setSlides(list);
            } catch (e) {
                console.error("Failed to load sliders", e);
            }
        })();
    }, []);

    useEffect(() => {
        if (!isAuto || slides.length === 0) return;
        const id = setInterval(() => {
            setCurrent((p) => (p + 1) % slides.length);
        }, 5000);
        return () => clearInterval(id);
    }, [isAuto, slides.length]);

    const goTo = (i: number) => {
        setCurrent(i);
        setIsAuto(false);
        setTimeout(() => setIsAuto(true), 10000);
    };

    const prev = () => {
        setCurrent((p) => (p - 1 + slides.length) % slides.length);
        setIsAuto(false);
        setTimeout(() => setIsAuto(true), 10000);
    };

    if (slides.length === 0) return null;

    const slide = slides[current];
    const portraitSrc = slide.imageUrl;

    return (
        <>
            <div className="relative z-20 h-full flex items-center">
                <div className="w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 px-6 sm:px-8 lg:px-0">
                        <div className="hidden lg:flex w-[140px] shrink-0 flex-col justify-center items-center gap-4 self-stretch py-4">
                            <button
                                onClick={prev}
                                className="grid place-items-center w-8 h-8 "
                                aria-label="Previous slide"
                            >
                                <img src="/icons/fa-angle-left.svg" />
                            </button>
                            <div className="flex flex-col items-center gap-3">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i
                                            ? "bg-white scale-125"
                                            : "bg-white/50 hover:bg-white/75"
                                            }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div
                            className={`text-white space-y-6 flex-1 text-center lg:text-left ${locale === "ar" ? "md:ml-[64px] lg:ml-[64px]" : ""
                                }`}
                        >
                            <div className="overflow-hidden">
                                <h1
                                    key={`title-${current}`}
                                    className="text-[28px] sm:text-[34px] lg:text-[40px] font-[700]"
                                >
                                    {slide.title}
                                </h1>
                            </div>

                            <div className="overflow-hidden">
                                {slide.description && (
                                    <p
                                        key={`desc-${current}`}
                                        className="text-[16px] sm:text-[18px] font-[500] pe-0 lg:pe-[64px]"
                                    >
                                        {slide.description}
                                    </p>
                                )}
                            </div>

                            <div className="overflow-hidden">
                                <Link
                                    href={slide.readMore ?? "#"}
                                    key={`button-${current}`}
                                    className="inline-block bg-white text-[16px] sm:text-[18px] text-[#4B2615] font-[500] px-6 sm:px-8 py-2.5 sm:py-3 rounded-[12px] hover:bg-white/90 transition-colors"
                                >
                                    {locale === 'ar' ? "اقرأ المزيد" : "Read More"}
                                </Link>
                            </div>
                        </div>

                        <div
                            className={`relative order-first lg:order-none ${locale === "ar"
                                ? "md:ml-[64px] lg:ml-[64px]"
                                : "md:mr-[64px] lg:mr-[64px]"
                                }`}
                        >
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-[#643F2E]">
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={portraitSrc}
                                        alt={slide.alt ?? slide.title}
                                        fill
                                        className="object-cover"
                                        key={`portrait-${current}`}
                                        sizes="(max-width: 640px) 16rem, (max-width: 1024px) 18rem, 24rem"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex lg:hidden space-x-3">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300  ${current === i
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </>
    );
}
