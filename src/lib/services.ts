import { ServiceApiItem, ServiceItem } from "@/types/service";
import type { SliderApiItem, Slide } from "@/types/slider";
import type { CreateSubmissionInput, SubmissionResult } from "@/types/submission";
import type { TeamApiItem, TeamMember } from "@/types/team";
import type { TestimonialApiItem, Testimonial } from "@/types/testimonial";
export const CMS =
    process.env.NEXT_PUBLIC_CMS

const abs = (p?: string | null) =>
    !p ? "" : p.startsWith("http") ? p : `${CMS}${p}`;

export async function createSubmission(
    input: CreateSubmissionInput
): Promise<SubmissionResult> {
    const res = await fetch(`${CMS}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ data: { email: input.email } }),
    });

    const json = await res.json().catch(() => ({} as any));

    if (res.ok) {
        const id = json?.data?.id as number | undefined;
        return { status: "ok", id };
    }

    const code =
        json?.error?.details?.errors?.[0]?.extensions?.code ||
        json?.error?.name ||
        "";
    const msg = (json?.error?.message as string) || "";
    const isUnique =
        code?.toString().toLowerCase().includes("unique") ||
        msg.toLowerCase().includes("unique");

    if (isUnique) return { status: "already" };
    return { status: "error", message: msg || "Request failed" };
}

export async function fetchSliders(locale: "en" | "ar"): Promise<Slide[]> {
    const url =
        `${CMS}/api/sliders` +
        `?fields[0]=title&fields[1]=description&fields[2]=readMore` +
        `&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText` +
        `&sort=createdAt:desc
        &locale=${locale}`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const list: Slide[] =
        json?.data?.map((d: SliderApiItem) => {
            const rawUrl =
                d?.image?.url ??
                d?.attributes?.image?.data?.attributes?.url ??
                d?.attributes?.image?.url ??
                "";
            const alt =
                d?.image?.alternativeText ??
                d?.attributes?.image?.data?.attributes?.alternativeText ??
                null;

            return {
                id: (d as any).id,
                title: (d as any).title ?? d?.attributes?.title ?? "",
                description:
                    (d as any).description ?? d?.attributes?.description ?? null,
                readMore: (d as any).readMore ?? d?.attributes?.readMore ?? null,
                imageUrl: abs(rawUrl),
                alt,
            };
        }) ?? [];

    return list;
}

export async function fetchTeamMembers(locale: "en" | "ar"): Promise<TeamMember[]> {
    const url =
        `${CMS}/api/teams` +
        `?fields[0]=name&fields[1]=position&fields[2]=whatsapp&fields[3]=phone&fields[4]=email` +
        `&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText` +
        `&sort=createdAt:desc` +
        `&locale=${locale}`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const list: TeamMember[] =
        json?.data?.map((d: TeamApiItem) => {
            const rawUrl =
                d?.image?.url ??
                d?.attributes?.image?.data?.attributes?.url ??
                d?.attributes?.image?.url ??
                null;
            const alt =
                d?.image?.alternativeText ??
                d?.attributes?.image?.data?.attributes?.alternativeText ??
                null;

            return {
                id: (d as any).id,
                name: (d as any).name ?? d?.attributes?.name ?? "",
                position: (d as any).position ?? d?.attributes?.position ?? null,
                whatsapp: (d as any).whatsapp ?? d?.attributes?.whatsapp ?? null,
                phone: (d as any).phone ?? d?.attributes?.phone ?? null,
                email: (d as any).email ?? d?.attributes?.email ?? null,
                imageUrl: abs(rawUrl),
                imageAlt: alt ?? null,
            };
        }) ?? [];

    return list;
}



export async function fetchTestimonials(locale: "en" | "ar"): Promise<Testimonial[]> {
    const url =
        `${CMS}/api/testimonials` +
        `?fields[0]=title&fields[1]=subTitle&fields[2]=description&fields[3]=name&fields[4]=position` +
        `&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText` +
        `&sort=createdAt:desc` +
        `&locale=${locale}`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const list: Testimonial[] =
        json?.data?.map((d: TestimonialApiItem) => {
            const rawUrl =
                d?.image?.url ??
                d?.attributes?.image?.data?.attributes?.url ??
                d?.attributes?.image?.url ??
                null;

            const alt =
                d?.image?.alternativeText ??
                d?.attributes?.image?.data?.attributes?.alternativeText ??
                null;

            return {
                id: (d as any).id,
                title: (d as any).title ?? d?.attributes?.title ?? null,
                subTitle: (d as any).subTitle ?? d?.attributes?.subTitle ?? null,
                description: (d as any).description ?? d?.attributes?.description ?? null,
                name: (d as any).name ?? d?.attributes?.name ?? null,
                position: (d as any).position ?? d?.attributes?.position ?? null,
                imageUrl: abs(rawUrl),
                imageAlt: alt ?? null,
            };
        }) ?? [];

    return list;
}
export async function fetchServicesList(locale: "en" | "ar"): Promise<ServiceItem[]> {
    const url =
        `${CMS}/api/services?fields[0]=title&fields[1]=slug` +
        `&locale=${locale}&sort=title:asc`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const items: ServiceItem[] =
        json?.data?.map((d: ServiceApiItem) => ({
            id: (d as any).id,
            title: d.title ?? d.attributes?.title ?? "",
            slug: d.slug ?? d.attributes?.slug ?? "",
        })) ?? [];

    return items;
}