import React, {lazy} from 'react'
import {Navigate, Route, Routes} from "react-router-dom"
import Layout from "../pages/Layout/Layout"
import UserRoutes from "./UserRoutes"
import {useAppSelector} from "@hooks/useRedux";

const AuthForm = lazy(() => import('../pages/Auth/AuthForm'))

const AppRouter = () => {
    const isAuth = useAppSelector(state => state.user.isAuth)

    if (!isAuth) {
        return (
            <Routes>
                <Route path="*" element={<AuthForm/>}/>
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                {UserRoutes.map(({path, Component}) => (
                    <Route key={path} path={path} element={<Component/>}/>
                ))}
                <Route path="*" element={<Navigate to={"/"}/>}/>
            </Route>
        </Routes>
    )
}

export default AppRouter