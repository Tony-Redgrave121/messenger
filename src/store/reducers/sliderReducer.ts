import {createSlice} from "@reduxjs/toolkit"

interface IAppState {
    currVideo: string,
    zoom: boolean,
    volume: string,
}

const initialState: IAppState = {
    currVideo: '',
    zoom: false,
    volume: '80'
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setCurrVideo(state, action) {
            state.currVideo = action.payload
        },
        setZoom(state, action) {
            state.zoom = action.payload
        },
        setVolume(state, action) {
            state.volume = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setCurrVideo,
    setZoom,
    setVolume
} = appSlice.actions
