"use client";
import React, { createContext, useContext } from "react";

type Locale = Record<string, any>;

const LocaleContext = createContext<Locale>({});

export function DictProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useDict<T = any>() {
  return useContext(LocaleContext) as T;
}
