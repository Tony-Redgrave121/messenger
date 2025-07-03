import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface ISidebarState {
    sidebarLeft: boolean,
}

const initialState: ISidebarState = {
    sidebarLeft: true,
}

const appSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setSidebarLeft(state, action: PayloadAction<boolean>) {
            state.sidebarLeft = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setSidebarLeft
} = appSlice.actions
