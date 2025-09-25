import { configureStore } from "@reduxjs/toolkit";
import { pollApi } from "./api/pollApi";
import pollSlice from "./slices/pollSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
    reducer: {
        poll: pollSlice,
        ui: uiSlice,
        [pollApi.reducerPath]: pollApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"],
            },
        }).concat(pollApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
