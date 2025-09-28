export type TestimonialApiItem = {
    id: number;
    title?: string | null;
    subTitle?: string | null;
    description?: string | null;
    name?: string | null;
    position?: string | null;
    image?: { url?: string | null; alternativeText?: string | null } | null;
    attributes?: {
        title?: string | null;
        subTitle?: string | null;
        description?: string | null;
        name?: string | null;
        position?: string | null;
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

export type Testimonial = {
    id: number;
    title: string | null;
    subTitle: string | null;
    description: string | null;
    name: string | null;
    position: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
};
