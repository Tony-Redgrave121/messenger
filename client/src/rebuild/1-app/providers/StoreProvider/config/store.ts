import {Action, combineReducers, configureStore, ThunkAction} from "@reduxjs/toolkit"
import userReducer from "@store/reducers/userReducer"
import appReducer from "@store/reducers/appReducer"
import sliderReducer from "@store/reducers/sliderReducer"
import messengerSlice from "../../../../5-entities/Messenger/model/slice/messengerSlice";
import contactSlice from "../../../../5-entities/Contact/model/slice/contactSlice";
import videoReducer from "@store/reducers/videoReducer";

const rootReducer = combineReducers({
    user: userReducer,
    app: appReducer,
    messenger: messengerSlice,
    contact: contactSlice,
    slider: sliderReducer,
    video: videoReducer,
})

export const setupStore = () => configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>