import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Locale = "en" | "ar";
export interface LocaleState { locale: Locale }

const initialState: LocaleState = { locale: "en" };

const localeSlice = createSlice({
    name: "locale",
    initialState,
    reducers: {
        setLocale: (state, action: PayloadAction<Locale>) => { state.locale = action.payload; },
        toggleLocale: (state) => { state.locale = state.locale === "ar" ? "en" : "ar"; },
    },
});

export const { setLocale, toggleLocale } = localeSlice.actions;
export default localeSlice.reducer;
