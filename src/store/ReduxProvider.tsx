"use client";

import { PropsWithChildren, useMemo, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from ".";
import { setLocale, Locale } from "./localeSlice";

export default function ReduxProvider({
    children,
    initialLocale = "en",
}: PropsWithChildren<{ initialLocale?: Locale }>) {
    const store = useMemo(
        () => makeStore({ locale: { locale: initialLocale } }),
        [initialLocale]
    );
    useEffect(() => {
        const unsub = store.subscribe(() => {
            try {
                const l = store.getState().locale.locale;
                localStorage.setItem("locale", l);
            } catch { }
        });
        return unsub;
    }, [store]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("locale") as Locale | null;
            if (saved) store.dispatch(setLocale(saved));
        } catch { }
    }, [store]);

    return <Provider store={store}>{children}</Provider>;
}
