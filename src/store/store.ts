import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from "./reducers/userReducer"
import appReducer from "./reducers/appReducer"
import sliderReducer from "./reducers/sliderReducer"

const rootReducer = combineReducers({
    user: userReducer,
    app: appReducer,
    slider: sliderReducer
})

export const setupStore = () => configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']