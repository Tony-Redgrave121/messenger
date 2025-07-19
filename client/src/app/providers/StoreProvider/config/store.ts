import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import contactSlice from '@entities/Contact/model/slice/contactSlice';
import sliderReducer from '@entities/Media/model/slice/sliderSlice';
import videoReducer from '@entities/Media/model/slice/videoSlice';
import popupSlice from '@entities/Message/model/slice/popupSlice';
import messengerSlice from '@entities/Messenger/model/slice/messengerSlice';
import sidebarSlice from '@entities/Messenger/model/slice/sidebarSlice';
import wrapperSlice from '@entities/Messenger/model/slice/wrapperSlice';
import userReducer from '@entities/User/model/slice/userSlice';

const rootReducer = combineReducers({
    user: userReducer,
    wrapper: wrapperSlice,
    messenger: messengerSlice,
    contact: contactSlice,
    slider: sliderReducer,
    video: videoReducer,
    popup: popupSlice,
    sidebar: sidebarSlice,
});

export const setupStore = () =>
    configureStore({
        reducer: rootReducer,
    });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
