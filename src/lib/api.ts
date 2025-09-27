const CMS = process.env.NEXT_PUBLIC_CMS!;
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${CMS}${path}`, { next: { revalidate: 60 }, ...init });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
}
