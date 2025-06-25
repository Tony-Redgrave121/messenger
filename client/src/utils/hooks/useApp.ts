import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {useEffect} from "react";
import {updateIsLoading} from "@store/reducers/userReducer";
import {userCheckAuth} from "@store/thunks/userThunks";

const useApp = () => {
    const isLoading = useAppSelector(state => state.user.isLoading)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (localStorage.getItem('token')) dispatch(userCheckAuth())
        else dispatch(updateIsLoading(false))
    }, [dispatch])

    return {isLoading}
}

export default useApp