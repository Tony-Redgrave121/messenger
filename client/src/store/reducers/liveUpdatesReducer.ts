import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IContact, IMessengersListResponse, IUpdateMessenger} from "@appTypes"

interface ILiveUpdatesState {
    messengers: IMessengersListResponse[],
    notifications: Record<string, number>,
    contacts: IContact[]
}

const initialState: ILiveUpdatesState = {
    messengers: [],
    notifications: {},
    contacts: []
}

const liveUpdatesSlice = createSlice({
    name: "liveUpdates",
    initialState,
    reducers: {
        setMessengers(state, action: PayloadAction<IMessengersListResponse[]>) {
            state.messengers = action.payload
        },
        addMessenger(state, action: PayloadAction<IMessengersListResponse>) {
            const exists = state.messengers.some(m => m.messenger_id === action.payload.messenger_id)
            if (!exists) state.messengers.push(action.payload)
        },
        updateMessengerMessage(state, action: PayloadAction<IUpdateMessenger>) {
            const {messenger_id, message_text, message_date} = action.payload
            const index = state.messengers.findIndex(m => m.messenger_id === messenger_id)
            if (index !== -1) {
                state.messengers[index].messages = [{message_text, message_date}]
            }
        },
        setNotificationCount(state, action: PayloadAction<{ messenger_id: string, count: number }>) {
            state.notifications[action.payload.messenger_id] = action.payload.count
        },
        removeMessenger(state, action: PayloadAction<string>) {
            state.messengers = state.messengers.filter(m => m.messenger_id !== action.payload)
            delete state.notifications[action.payload]
        },
        setContacts(state, action: PayloadAction<IContact[]>) {
            state.contacts = action.payload
        },
        addContact(state, action: PayloadAction<IContact>) {
            const exists = state.contacts.some(c => c.user_id === action.payload.user_id)
            if (!exists) state.contacts.push(action.payload)
        },
        deleteContact(state, action: PayloadAction<string>) {
            state.contacts = state.contacts.filter(c => c.user_id !== action.payload)
        },
        setNotificationsFromStorage(state, action: PayloadAction<Record<string, number>>) {
            state.notifications = action.payload
        }
    }
})

export default liveUpdatesSlice.reducer
export const {
    setMessengers,
    addMessenger,
    setContacts,
    addContact,
    deleteContact,
    updateMessengerMessage,
    setNotificationCount,
    removeMessenger,
    setNotificationsFromStorage
} = liveUpdatesSlice.actions
