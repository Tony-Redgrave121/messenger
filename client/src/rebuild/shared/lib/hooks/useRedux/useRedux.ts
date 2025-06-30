import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import {AppDispatch, RootState} from "../../../../1-app/providers/StoreProvider/config/store"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector