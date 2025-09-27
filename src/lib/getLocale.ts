export type Locale = "en" | "ar";

export async function getDictionary(locale: Locale) {
    switch (locale) {
        case "ar":
            return (await import("@/internationalization/ar.json")).default;
        case "en":
        default:
            return (await import("@/internationalization/en.json")).default;
    }
}
