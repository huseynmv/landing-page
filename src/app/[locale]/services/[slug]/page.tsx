
import Image from "next/image";
import heroImg from "@/assets/heroImg.jpg";
import animation from "@/assets/animation.webp";
import BackButton from "./BackBtn";

const CMS = process.env.NEXT_PUBLIC_CMS

type Params = { locale: "en" | "ar"; slug: string };

type ServiceItem = { id: number; text?: string | null };
type ServiceBody = {
    id: number;
    category?: string | null;
    title?: string | null;
    subtitle?: string | null;
    items?: ServiceItem[];
};
type Service = {
    id: number;
    title: string;
    slug: string;
    description?: string | null;
    summary?: string | null;
    body?: ServiceBody[];
};

async function fetchServiceBySlug(slug: string, locale: "en" | "ar"): Promise<Service | null> {
    const qs =
        `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
        `&locale=${locale}` +
        `&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=summary` +
        `&populate[body][fields][0]=category` +
        `&populate[body][fields][1]=title` +
        `&populate[body][fields][2]=subtitle` +
        `&populate[body][populate][items][fields][0]=text`;

    const res = await fetch(`${CMS}/api/services${qs}`, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    const raw = json?.data?.[0];
    if (!raw) return null;

    const get = (k: string) => raw[k] ?? raw.attributes?.[k];

    return {
        id: raw.id,
        title: get("title"),
        slug: get("slug"),
        description: get("description"),
        summary: get("summary"),
        body:
            (get("body") || []).map((b: any) => ({
                id: b.id,
                category: b.category ?? b?.attributes?.category ?? null,
                title: b.title ?? b?.attributes?.title ?? null,
                subtitle: b.subtitle ?? b?.attributes?.subtitle ?? null,
                items:
                    (b.items ?? b?.attributes?.items ?? []).map((it: any) => ({
                        id: it.id,
                        text: it.text ?? it?.attributes?.text ?? null,
                    })) || [],
            })) || [],
    };
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
    const { slug, locale } = await params;

    let service = await fetchServiceBySlug(slug, locale);
    if (!service && locale === "ar") service = await fetchServiceBySlug(slug, "en");
    if (!service) {
        return (
            <main className="px-6 py-16 max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold">Service not found</h1>
            </main>
        );
    }

    return (
        <main>
            <section className="relative h-screen overflow-hidden">
                <Image src={heroImg} alt="" fill priority className="object-cover saturate-0" />
                <div className="absolute inset-0 bg-[linear-gradient(271.47deg,rgba(75,38,21,0.28)_1.2%,rgba(75,38,21,0.68)_86.38%)]" />
            </section>
            <div className="relative z-10 h-full px-6 flex items-start">
                <div className={`max-w-5xl w-full mx-auto pt-8 px-6 ${locale === 'ar' ? 'flex justify-end' : ""}`}>
                    <BackButton
                        ariaLabel="Previous page"
                        className={`w-10 ${locale === "ar" ? "rtl-flip" : ""} inline-flex items-center gap-2 text-[#4B2615] hover:opacity-90 text-sm md:text-base w-fit`}
                    >
                        <ChevronLeft className="text-black rtl-flip" />
                        {locale === "en" ? "Back" : "خلف"}
                    </BackButton>
                </div>
            </div>
            <section className="relative overflow-x-clip">
                <Image
                    src={animation}
                    alt=""
                    aria-hidden="true"
                    priority={false}
                    sizes="(max-width: 640px) 110vw, (max-width: 1024px) 800px, 900px"
                    className="
      pointer-events-none
      absolute left-1/2 -translate-x-1/2
      -z-[9999]
      top-[-24px] sm:top-[-12px]
      w-[110vw] sm:w-[800px] md:w-[900px] max-w-none
      opacity-80
    "
                />

                <div className="relative max-w-5xl mx-auto px-6 py-8">
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
                        {service.title}
                    </h1>
                    {service.description && (
                        <p className="mt-4 text-[15px] leading-7 text-[#6F6F6F] whitespace-pre-line">
                            {service.description}
                        </p>
                    )}

                    {service.body?.length ? (
                        <section className="mt-8 space-y-10">
                            {service.body.map((sec) => (
                                <article key={sec.id}>
                                    {sec.category && (
                                        <div className="text-[13px] font-semibold text-[#5A3A2B]">
                                            {sec.category}
                                        </div>
                                    )}

                                    <div className={`mt-2 border-neutral-200 ${locale === 'ar' ? "pr-4 border-r-2" : "pl-4 border-l-2"
                                        }`}>
                                        <div className="flex items-start gap-2">
                                            <span className="mt-[6px] inline-block w-2 h-2 bg-[#5A3A2B] rounded-sm" />
                                            <div>
                                                {sec.title && (
                                                    <p className="font-semibold text-[15px] text-[#2E2E2E]">
                                                        {sec.title}
                                                    </p>
                                                )}
                                                {sec.subtitle && (
                                                    <p className="mt-1 text-[14px] text-[#6F6F6F]">
                                                        {sec.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {sec.items?.length ? (
                                            <ul className="mt-3 space-y-2 text-[14px] text-[#6F6F6F]">
                                                {sec.items.map((it) => (
                                                    <li key={it.id} className="flex gap-2">
                                                        <span className="select-none text-neutral-400">–</span>
                                                        <span className="leading-6">{it.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                </article>
                            ))}
                        </section>
                    ) : null}

                    {service.summary && (
                        <div className="mt-10 text-[14px] text-[#6F6F6F]">
                            {service.summary}
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}