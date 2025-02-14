import {createSlice} from "@reduxjs/toolkit"

interface IAppState {
    sidebarLeft: boolean
}

const initialState: IAppState = {
    sidebarLeft: true
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSidebarLeft(state, action) {
            state.sidebarLeft = action.payload
        },
    }
})

export default appSlice.reducer
export const {
    setSidebarLeft
} = appSlice.actions
