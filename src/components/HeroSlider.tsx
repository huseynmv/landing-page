"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_CMS ?? "https://romantic-victory-de00aedaff.strapiapp.com";

type Slide = {
    id: number;
    title: string;
    description: string | null;
    readMore: string | null;
    imageUrl: string;
    alt?: string | null;
};

export default function HeroSlider() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [current, setCurrent] = useState(0);
    const [isAuto, setIsAuto] = useState(true);

    useEffect(() => {
        const url =
            `${BASE}/api/sliders` +
            `?fields[0]=title&fields[1]=description&fields[2]=readMore` +
            `&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText` +
            `&sort=createdAt:desc`;

        (async () => {
            try {
                const res = await fetch(url, { cache: "no-store" });
                const json = await res.json();
                const list: Slide[] =
                    json?.data?.map((d: any) => ({
                        id: d.id,
                        title: d.title ?? d.attributes?.title,
                        description: d.description ?? d.attributes?.description ?? null,
                        readMore: d.readMore ?? d.attributes?.readMore ?? null,
                        imageUrl:
                            d.image?.url ??
                            d.attributes?.image?.data?.attributes?.url ??
                            "",
                        alt:
                            d.image?.alternativeText ??
                            d.attributes?.image?.data?.attributes?.alternativeText ??
                            null,
                    })) ?? [];
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
    const portraitSrc = slide.imageUrl.startsWith("http")
        ? slide.imageUrl
        : `${BASE}${slide.imageUrl}`;

    return (
        <>
            <div className="relative z-20 h-full flex items-center">
                <div className="w-full">
                    <div className="flex items-center justify-center">
                        <div className="hidden lg:flex w-[140px] shrink-0 flex-col justify-center items-center gap-4 self-stretch py-4">
                            <button
                                onClick={prev}
                                className="grid place-items-center w-8 h-8 rounded-full ring-1 ring-white/70 text-white hover:bg-white/10 transition-colors"
                                aria-label="Previous slide"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="flex flex-col items-center gap-3">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                                            }`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-white space-y-6 flex-1">
                            <div className="overflow-hidden">
                                <h1
                                    key={`title-${current}`}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                                >
                                    {slide.title}
                                </h1>
                            </div>

                            <div className="overflow-hidden">
                                {slide.description && (
                                    <p
                                        key={`desc-${current}`}
                                        className="text-lg md:text-xl text-white/90 leading-relaxed pr-[64px]"
                                    >
                                        {slide.description}
                                    </p>
                                )}
                            </div>

                            <div className="overflow-hidden">
                                <Link
                                    href={slide.readMore ?? "#"}
                                    key={`button-${current}`}
                                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                        <div className="relative" style={{ marginRight: "64px" }}>
                            <div className="relative w-80 h-80 lg:w-96 lg:h-96 bg-[#643F2E]">
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={portraitSrc}
                                        alt={slide.alt ?? slide.title}
                                        fill
                                        className="object-cover"
                                        key={`portrait-${current}`}
                                        sizes="(max-width: 1024px) 20rem, 24rem"
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
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </>
    );
    //       {/* <style jsx>{`
    //         @keyframes slide-in-left {
    //           from {
    //             opacity: 0;
    //             transform: translateX(-30px);
    //           }
    //           to {
    //             opacity: 1;
    //             transform: translateX(0);
    //           }
    //         }

    //         @keyframes fade-in {
    //           from {
    //             opacity: 0;
    //             transform: scale(0.95);
    //           }
    //           to {
    //             opacity: 1;
    //             transform: scale(1);
    //           }
    //         }

    //         .animate-slide-in-left {
    //           animation: slide-in-left 0.8s ease-out;
    //         }

    //         .animate-fade-in {
    //           animation: fade-in 0.8s ease-out;
    //         }
    //       `}</style> */}
    //     </section>
    //   );
    // }
}
