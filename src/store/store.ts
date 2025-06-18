import {Action, combineReducers, configureStore, ThunkAction} from "@reduxjs/toolkit"
import userReducer from "./reducers/userReducer"
import appReducer from "./reducers/appReducer"
import sliderReducer from "./reducers/sliderReducer"
import liveUpdatesReducer from "@store/reducers/liveUpdatesReducer";
import videoReducer from "@store/reducers/videoReducer";

const rootReducer = combineReducers({
    user: userReducer,
    app: appReducer,
    live: liveUpdatesReducer,
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