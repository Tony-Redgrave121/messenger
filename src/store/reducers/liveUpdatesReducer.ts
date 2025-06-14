import {createSlice} from "@reduxjs/toolkit"
import {IContact, IMessengersListResponse} from "@appTypes"

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
        setMessengers(state, action) {
            state.messengers = action.payload
        },
        addMessenger(state, action) {
            const exists = state.messengers.some(messenger => messenger.messenger_id === action.payload.messenger_id)

            if (!exists) state.messengers.push(action.payload)
        },
        updateMessenger(state, action) {
            const {messenger_id, message_text, message_date, isCurrentMessenger} = action.payload
            const index = state.messengers.findIndex(messenger => messenger.messenger_id === messenger_id)

            if (index !== -1) {
                state.messengers[index] = {
                    ...state.messengers[index],
                    messages: [{message_text, message_date}]
                }

                if (!isCurrentMessenger) {
                    const notifications = JSON.parse(localStorage.getItem('messengersNotifications') || '{}')
                    notifications[messenger_id] = (notifications[messenger_id] ?? 0) + 1

                    localStorage.setItem('messengersNotifications', JSON.stringify(notifications))
                    state.notifications[messenger_id] = notifications[messenger_id]
                }
            }
        },
        deleteMessenger(state, action) {
            const messengerId = action.payload

            state.messengers = state.messengers.filter(messenger => messenger.messenger_id !== messengerId)

            const notifications = JSON.parse(localStorage.getItem('messengersNotifications') || '{}')
            delete notifications[messengerId]

            localStorage.setItem('messengersNotifications', JSON.stringify(notifications))
            delete state.notifications[messengerId]
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
        syncNotifications(state) {
            state.notifications = JSON.parse(localStorage.getItem('messengersNotifications') || '{}')
        },
        clearNotification(state, action) {
            const messengerId = action.payload

            const notifications = JSON.parse(localStorage.getItem('messengersNotifications') || '{}')
            notifications[messengerId] = 0

            localStorage.setItem('messengersNotifications', JSON.stringify(notifications))
            state.notifications[messengerId] = 0
        }
    }
})

export default liveUpdatesSlice.reducer
export const {
    setMessengers,
    addMessenger,
    deleteMessenger,
    updateMessenger,
    setContacts,
    addContact,
    deleteContact,
    syncNotifications,
    clearNotification
} = liveUpdatesSlice.actions
