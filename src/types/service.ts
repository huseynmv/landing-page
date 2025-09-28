export type ServiceApiItem = {
    id: number;
    title?: string;
    slug?: string;
    attributes?: {
        title?: string;
        slug?: string;
    };
};

export type ServiceItem = {
    id: number;
    title: string;
    slug: string;
};
