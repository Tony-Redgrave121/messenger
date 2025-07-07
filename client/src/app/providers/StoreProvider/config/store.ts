import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import sidebarSlice from '@widgets/LeftSidebar/model/slice/sidebarSlice';
import wrapperSlice from '@widgets/Main/model/slice/wrapperSlice';
import popupSlice from '@features/PopupMessage/model/slice/popupSlice';
import sliderReducer from '@features/Slider/model/slice/sliderSlice';
import contactSlice from '@entities/Contact/model/slice/contactSlice';
import videoReducer from '@entities/Media/model/slice/videoSlice';
import messengerSlice from '@entities/Messenger/model/slice/messengerSlice';
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
