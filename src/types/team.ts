export type TeamApiItem = {
    id: number;
    name?: string | null;
    position?: string | null;
    whatsapp?: string | null;
    phone?: string | null;
    email?: string | null;
    image?: { url?: string | null; alternativeText?: string | null } | null;
    attributes?: {
        name?: string | null;
        position?: string | null;
        whatsapp?: string | null;
        phone?: string | null;
        email?: string | null;
        image?: {
            data?: {
                attributes?: {
                    url?: string | null;
                    alternativeText?: string | null;
                } | null;
            } | null;
            url?: string | null;
            alternativeText?: string | null;
        } | null;
    } | null;
};

export type TeamMember = {
    id: number;
    name: string;
    position: string | null;
    whatsapp: string | null;
    phone: string | null;
    email: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
};
