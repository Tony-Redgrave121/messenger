import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface IPopupState {
    popupChildren: string,
    popupState: boolean,
}

const initialState: IPopupState = {
    popupChildren: '',
    popupState: false,
}

const appSlice = createSlice({
    name: "popup",
    initialState,
    reducers: {
        setPopupChildren(state, action: PayloadAction<string>) {
            state.popupChildren = action.payload
        },
        setPopupState(state, action: PayloadAction<boolean>) {
            state.popupState = action.payload
        },
    }
})

export default appSlice.reducer
export const {
    setPopupChildren,
    setPopupState
} = appSlice.actions
