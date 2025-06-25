import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface ISliderState {
    zoom: boolean,
}

const initialState: ISliderState = {
    zoom: false,
}

const appSlice = createSlice({
    name: "slider",
    initialState,
    reducers: {
        setZoom(state, action: PayloadAction<boolean>) {
            state.zoom = action.payload
        }
    }
})

export default appSlice.reducer
export const {
    setZoom
} = appSlice.actions
