"use client";
import { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore, type RootState } from ".";

export default function ReduxProvider({
    children,
    initialState,
}: {
    children: React.ReactNode;
    initialState?: Partial<RootState>;
}) {
    const store = useMemo(() => makeStore(initialState as any), [initialState]);
    return <Provider store={store}>{children}</Provider>;
}
