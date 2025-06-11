import {createSlice} from "@reduxjs/toolkit"
import {IContact, IMessengersListResponse} from "@appTypes"

interface ILiveUpdatesState {
    newMessenger: IMessengersListResponse[] | null,
    contacts: IContact[]
}

const initialState: ILiveUpdatesState = {
    newMessenger: null,
    contacts: []
}

const liveUpdatesSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setMessengersList(state, action) {
            if (Array.isArray(action.payload)) state.newMessenger = action.payload
            else state.newMessenger = [action.payload]
        },
        setContacts(state, action) {
            state.contacts = [...state.contacts, ...action.payload]
        },
        deleteContact(state, action) {
            state.contacts = [...state.contacts.filter(contact => contact.user_id !== action.payload)]
        },
    }
})

export default liveUpdatesSlice.reducer
export const {
    setMessengersList,
    setContacts,
    deleteContact
} = liveUpdatesSlice.actions
