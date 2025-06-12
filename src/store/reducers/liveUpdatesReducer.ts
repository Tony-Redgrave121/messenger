import {createSlice} from "@reduxjs/toolkit"
import {IContact, IMessengersListResponse} from "@appTypes"

interface ILiveUpdatesState {
    messengers: IMessengersListResponse[],
    contacts: IContact[]
}

const initialState: ILiveUpdatesState = {
    messengers: [],
    contacts: []
}

const liveUpdatesSlice = createSlice({
    name: "liveUpdates",
    initialState,
    reducers: {
        setMessengers(state, action) {
            state.messengers = action.payload
        },
        addMessenger(state, action) {
            const exists = state.messengers.some(messenger => messenger.messenger_id === action.payload.messenger_id)
            if (!exists) state.messengers.push(action.payload)
        },
        deleteMessenger(state, action) {
            state.messengers = state.messengers.filter(messenger => messenger.messenger_id !== action.payload)
        },
        setContacts(state, action) {
            state.contacts = action.payload
        },
        addContact(state, action) {
            const exists = state.contacts.some(contact => contact.user_id === action.payload.user_id)
            if (!exists) state.contacts.push(action.payload)
        },
        deleteContact(state, action) {
            state.contacts = state.contacts.filter(contact => contact.user_id !== action.payload)
        },
    }
})

export default liveUpdatesSlice.reducer
export const {
    setMessengers,
    addMessenger,
    deleteMessenger,
    setContacts,
    addContact,
    deleteContact
} = liveUpdatesSlice.actions
