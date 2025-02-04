import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from "./reducers/userReducer"

const rootReducer = combineReducers({
    user: userReducer,
})

export const setupStore = () => configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']