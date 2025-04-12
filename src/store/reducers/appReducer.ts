import {createSlice} from "@reduxjs/toolkit"
import IMessengersListResponse from "../../types/IMessengersListResponse"

interface IAppState {
    sidebarLeft: boolean,
    newMessenger: IMessengersListResponse[] | null,
    currVideo: string,
}

const initialState: IAppState = {
    sidebarLeft: true,
    newMessenger: null,
    currVideo: '',
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
        setCurrVideo(state, action) {
            state.currVideo = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setSidebarLeft,
    setMessengersList,
    setCurrVideo,
} = appSlice.actions
