"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { setLocale, Locale } from "@/store/localeSlice";
import { usePathname, useRouter } from "next/navigation";

export default function LocaleSwitch() {
    const locale = useAppSelector(s => s.locale.locale);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const switchTo = (next: Locale) => {
        if (next === locale) return;
        dispatch(setLocale(next));
        const newPath = pathname.replace(/^\/(en|ar)/, `/${next}`);
        router.push(newPath);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => switchTo("en")}
                className={locale === "en" ? "underline" : "opacity-70 hover:opacity-100"}
            >
                EN
            </button>
            <span className="opacity-50">/</span>
            <button
                onClick={() => switchTo("ar")}
                className={locale === "ar" ? "underline" : "opacity-70 hover:opacity-100"}
            >
                AR
            </button>
        </div>
    );
}
