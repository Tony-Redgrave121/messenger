import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface IWrapperState {
    wrapperState: boolean,
}

const initialState: IWrapperState = {
    wrapperState: true,
}

const wrapperSlice = createSlice({
    name: "wrapper",
    initialState,
    reducers: {
        setWrapperState(state, action: PayloadAction<boolean>) {
            state.wrapperState = action.payload
        }
    }
})

export default wrapperSlice.reducer
export const {
    setWrapperState
} = wrapperSlice.actions
