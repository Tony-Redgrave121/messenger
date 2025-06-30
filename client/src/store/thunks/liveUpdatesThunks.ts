import {
    updateMessengerMessage,
    setNotificationCount,
    setNotificationsFromStorage,
    removeMessenger
} from '../../rebuild/5-entities/Messenger/model/slice/messengerSlice'
import {IUpdateMessenger} from "@appTypes";
import {AppThunk} from "../../rebuild/1-app/providers/StoreProvider/config/store";

const NOTIFICATIONS_KEY = 'messengersNotifications'

export const updateMessenger = (data: IUpdateMessenger): AppThunk => dispatch => {
    dispatch(updateMessengerMessage(data))

    const {isCurrentMessenger, messenger_id} = data
    if (isCurrentMessenger) return

    const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}'
    const stored = JSON.parse(raw)

    const newCount = (stored[messenger_id] || 0) + 1
    stored[messenger_id] = newCount
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(stored))

    dispatch(setNotificationCount({messenger_id, count: newCount}))
}

export const deleteMessenger = (messenger_id: string): AppThunk => dispatch => {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}'
    const stored = JSON.parse(raw)

    delete stored[messenger_id]
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(stored))

    dispatch(removeMessenger(messenger_id))
}

export const syncNotifications = (): AppThunk => dispatch => {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}'
    const stored = JSON.parse(raw)
    dispatch(setNotificationsFromStorage(stored))
}

export const clearNotification = (messenger_id: string): AppThunk => dispatch => {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}'
    const stored = JSON.parse(raw)

    stored[messenger_id] = 0
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(stored))

    dispatch(setNotificationCount({messenger_id, count: 0}))
}
