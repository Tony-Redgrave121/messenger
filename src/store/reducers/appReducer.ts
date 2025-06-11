import {createSlice} from "@reduxjs/toolkit"

interface IAppState {
    sidebarLeft: boolean,
    popupMessageChildren: string,
    popupMessageState: boolean,
    wrapperState: boolean,
}

const initialState: IAppState = {
    sidebarLeft: true,
    popupMessageChildren: '',
    popupMessageState: false,
    wrapperState: true,
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSidebarLeft(state, action) {
            state.sidebarLeft = action.payload
        },
        setPopupMessageChildren(state, action) {
            state.popupMessageChildren = action.payload
        },
        setPopupMessageState(state, action) {
            state.popupMessageState = action.payload
        },
        setWrapperState(state, action) {
            state.wrapperState = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setSidebarLeft,
    setPopupMessageChildren,
    setPopupMessageState,
    setWrapperState
} = appSlice.actions
