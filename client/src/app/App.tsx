import {AppRouter} from "./providers/RouterProvider"
import {Suspense, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@shared/lib";
import {userCheckAuth} from "@entities/User/lib/thunk/userThunk";
import {updateIsLoading} from "@entities/User/model/slice/userSlice";

function App() {
    const isLoading = useAppSelector(state => state.user.isLoading)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (localStorage.getItem('token')) dispatch(userCheckAuth())
        else dispatch(updateIsLoading(false))
    }, [dispatch])

    if (isLoading) return <></>

    return (
        <Suspense fallback={''}>
            <AppRouter/>
        </Suspense>
    )
}

export default App