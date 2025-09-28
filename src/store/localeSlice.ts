import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Locale = "en" | "ar";
type Dict = Record<string, any>;

interface LocaleState {
    locale: Locale;
    dict: Dict | null;
}

const initialState: LocaleState = {
    locale: "en",
    dict: null,
};

const slice = createSlice({
    name: "locale",
    initialState,
    reducers: {
        setLocale(state, action: PayloadAction<Locale>) {
            state.locale = action.payload;
        },
        setDict(state, action: PayloadAction<Dict>) {
            state.dict = action.payload;
        },
        toggleLocale(state) {
            state.locale = state.locale === "ar" ? "en" : "ar";
        },
    },
});

export const { setLocale, setDict, toggleLocale } = slice.actions;
export default slice.reducer;
