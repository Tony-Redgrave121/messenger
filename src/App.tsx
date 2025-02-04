import React, {useEffect} from 'react'
import AppRouter from "./router/AppRouter"
import {BrowserRouter} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from "./utils/hooks/useRedux";

function App() {
    // const isLoading = useAppSelector(state => state.user.isLoading)
    // const dispatch = useAppDispatch()
    //
    // useEffect(() => {
    //     if (localStorage.getItem('token')) dispatch(userCheckAuth())
    //     else dispatch(updateIsLoading(false))
    // }, [dispatch])
    //
    // if (isLoading) return <Loader />

    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App
