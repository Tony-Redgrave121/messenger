import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AppThunk } from '@app/providers/StoreProvider/config/store';
import fetchNotificationsApi from '@entities/Messenger/api/fetchNotificationsApi';
import { NOTIFICATIONS_KEY } from '@entities/Messenger/consts/MessengerKeys';
import {
    updateMessengerMessage,
    setNotificationCount,
    setNotificationsFromStorage,
    removeMessenger,
} from '@entities/Messenger/model/slice/messengerSlice';
import UpdateMessengerSchema from '@entities/Messenger/model/types/UpdateMessengerSchema';
import { ApiError } from '@shared/types';

export const updateMessenger =
    (data: UpdateMessengerSchema): AppThunk =>
    dispatch => {
        dispatch(updateMessengerMessage(data));

        const { isCurrentMessenger, messenger_id, message_id } = data;
        if (isCurrentMessenger) return;

        const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}';
        const stored = JSON.parse(raw);

        const newCount = (stored[messenger_id].count || 0) + 1;
        const newMessageId = stored[messenger_id].message_id
            ? stored[messenger_id].message_id
            : message_id;

        stored[messenger_id] = {
            count: newCount,
            message_id: newMessageId,
        };
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(stored));

        dispatch(setNotificationCount({ messenger_id, count: newCount, message_id: newMessageId }));
    };

export const deleteMessenger =
    (messenger_id: string): AppThunk =>
    dispatch => {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}';
        const stored = JSON.parse(raw);

        delete stored[messenger_id];
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(stored));

        dispatch(removeMessenger(messenger_id));
    };

export const syncNotifications = createAsyncThunk(
    'syncNotifications',
    async ({ user_id }: { user_id: string }, thunkAPI) => {
        try {
            const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}';
            const stored = JSON.parse(raw);

            const notifications = await fetchNotificationsApi(stored, user_id);
            const data = notifications.data;

            if (!data) return;

            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data));
            thunkAPI.dispatch(setNotificationsFromStorage(data));
        } catch (e) {
            const error = e as AxiosError<ApiError>;
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Server error');
        }
    },
);

export const clearNotification =
    (messenger_id: string): AppThunk =>
    dispatch => {
        const raw = localStorage.getItem(NOTIFICATIONS_KEY) || '{}';
        const stored = JSON.parse(raw);

        stored[messenger_id] = {
            count: 0,
            message_id: '',
        };
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(stored));

        dispatch(setNotificationCount({ messenger_id, count: 0, message_id: '' }));
    };
