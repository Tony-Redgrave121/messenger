export { default as ChatBlock } from './ui/СhatBlock/ChatBlock';

export { setSidebarRight, setSidebarLeft } from './model/slice/sidebarSlice';
export { setWrapperState } from './model/slice/wrapperSlice';
export {
    setMessengers,
    addMessenger,
    updateMessengerMessage,
    setNotificationCount,
    removeMessenger,
    setNotificationsFromStorage,
} from './model/slice/messengerSlice';

export {
    clearNotification,
    syncNotifications,
    deleteMessenger,
    updateMessenger,
} from './lib/thunk/messengerThunk';

export type { default as AdaptMessengerSchema } from './model/types/AdaptMessengerSchema';
export type { default as ChatBlockSchema } from './model/types/ChatBlockSchema';
export type { default as MessengerSettingsSchema } from './model/types/MessengerSettingsSchema';
export type { default as UpdateMessengerSchema } from './model/types/UpdateMessengerSchema';
export type { default as MessengerSettingsKeys } from './model/types/MessengerSettingsKeys';
export type { default as MessengerSchema } from './model/types/MessengerSchema';

export { useLiveUpdatesWS } from './lib/hooks/useLiveUpdatesWS';
export { default as fetchMessengerApi } from './api/fetchMessengerApi';
export { default as fetchMessagesApi } from './api/fetchMessagesApi';
export { default as mapMessengerDTO } from './api/mappers/mapMessengerDTO';
