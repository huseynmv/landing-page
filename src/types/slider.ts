export type SliderApiItem = {
    id: number;
    title?: string | null;
    description?: string | null;
    readMore?: string | null;
    image?: {
        url?: string | null;
        alternativeText?: string | null;
    } | null;
    attributes?: {
        title?: string | null;
        description?: string | null;
        readMore?: string | null;
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

export type Slide = {
    id: number;
    title: string;
    description: string | null;
    readMore: string | null;
    imageUrl: string;
    alt: string | null;
};
