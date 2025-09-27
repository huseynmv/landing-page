import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import localeReducer from "./localeSlice";

const rootReducer = combineReducers({
    locale: localeReducer,
});
export type RootReducer = typeof rootReducer;
export type RootState = ReturnType<RootReducer>;
export function makeStore(preloadedState?: any) {
    return configureStore({
        reducer: rootReducer,
        preloadedState: preloadedState as any,
        devTools: process.env.NODE_ENV !== "production",
    });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
