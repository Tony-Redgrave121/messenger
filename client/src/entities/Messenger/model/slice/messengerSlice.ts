import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ChatBlockSchema from '@entities/Messenger/model/types/ChatBlockSchema';
import NotificationSchema from '@entities/Messenger/model/types/NotificationSchema';
import UpdateMessengerSchema from '@entities/Messenger/model/types/UpdateMessengerSchema';

interface ILiveUpdatesState {
    messengers: ChatBlockSchema[];
    notifications: NotificationSchema;
}

const initialState: ILiveUpdatesState = {
    messengers: [],
    notifications: {},
};

const messengerSlice = createSlice({
    name: 'messengerSlice',
    initialState,
    reducers: {
        setMessengers(state, action: PayloadAction<ChatBlockSchema[]>) {
            state.messengers = action.payload;
        },
        addMessenger(state, action: PayloadAction<ChatBlockSchema>) {
            const exists = state.messengers.some(
                m => m.messenger_id === action.payload.messenger_id,
            );
            if (!exists) state.messengers.push(action.payload);
        },
        updateMessengerMessage(state, action: PayloadAction<UpdateMessengerSchema>) {
            const { messenger_id, message_text, message_date } = action.payload;
            const index = state.messengers.findIndex(m => m.messenger_id === messenger_id);
            if (index !== -1) {
                state.messengers[index].messages = [{ message_text, message_date }];
            }
        },
        setNotificationCount(
            state,
            action: PayloadAction<{
                messenger_id: string;
                message_id: string;
                count: number;
            }>,
        ) {
            state.notifications[action.payload.messenger_id] = {
                message_id: action.payload.message_id,
                count: action.payload.count,
            };
        },
        removeMessenger(state, action: PayloadAction<string>) {
            state.messengers = state.messengers.filter(m => m.messenger_id !== action.payload);
            delete state.notifications[action.payload];
        },
        setNotificationsFromStorage(state, action: PayloadAction<NotificationSchema>) {
            state.notifications = action.payload;
        },
    },
});

export default messengerSlice.reducer;
export const {
    setMessengers,
    addMessenger,
    updateMessengerMessage,
    setNotificationCount,
    removeMessenger,
    setNotificationsFromStorage,
} = messengerSlice.actions;
