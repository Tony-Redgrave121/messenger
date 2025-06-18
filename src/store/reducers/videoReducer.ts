import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface IVideoState {
    currVideo: string,
    volume: number,
}

const initialState: IVideoState = {
    currVideo: '',
    volume: 80
}

const appSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setCurrVideo(state, action: PayloadAction<string>) {
            state.currVideo = action.payload
        },
        setVolume(state, action: PayloadAction<number>) {
            state.volume = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setCurrVideo,
    setVolume
} = appSlice.actions
