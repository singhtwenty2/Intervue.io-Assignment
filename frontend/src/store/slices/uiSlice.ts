import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    isLoading: boolean;
    error: string | null;
    notification: {
        message: string;
        type: "success" | "error" | "info";
    } | null;
    isConnected: boolean;
}

const initialState: UiState = {
    isLoading: false,
    error: null,
    notification: null,
    isConnected: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setNotification: (
            state,
            action: PayloadAction<UiState["notification"]>,
        ) => {
            state.notification = action.payload;
        },
        clearNotification: (state) => {
            state.notification = null;
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
    },
});

export const {
    setLoading,
    setError,
    setNotification,
    clearNotification,
    setConnected,
} = uiSlice.actions;

export default uiSlice.reducer;
