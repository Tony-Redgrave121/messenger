import {createSlice} from "@reduxjs/toolkit"
import {IMessengersListResponse} from "@appTypes"

interface IAppState {
    sidebarLeft: boolean,
    newMessenger: IMessengersListResponse[] | null,
    popupMessageChildren: string,
    popupMessageState: boolean,
}

const initialState: IAppState = {
    sidebarLeft: true,
    newMessenger: null,
    popupMessageChildren: '',
    popupMessageState: false,
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSidebarLeft(state, action) {
            state.sidebarLeft = action.payload
        },
        setMessengersList(state, action) {
            if (Array.isArray(action.payload)) state.newMessenger = action.payload
            else state.newMessenger = [action.payload]
        },
        setPopupMessageChildren(state, action) {
            state.popupMessageChildren = action.payload
        },
        setPopupMessageState(state, action) {
            state.popupMessageState = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setSidebarLeft,
    setMessengersList,
    setPopupMessageChildren,
    setPopupMessageState
} = appSlice.actions
