import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISidebarState {
    sidebarLeft: boolean;
    sidebarRight: boolean;
}

const initialState: ISidebarState = {
    sidebarLeft: true,
    sidebarRight: false,
};

const appSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setSidebarLeft(state, action: PayloadAction<boolean>) {
            state.sidebarLeft = action.payload;
        },
        setSidebarRight(state, action: PayloadAction<boolean>) {
            state.sidebarRight = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { setSidebarLeft, setSidebarRight } = appSlice.actions;
