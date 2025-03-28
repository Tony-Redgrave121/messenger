import React, {lazy} from 'react'
import {Navigate, Route, Routes} from "react-router-dom"
import Layout from "../components/layout/Layout"
import UserRoutes from "./UserRoutes"
import {useAppSelector} from "../utils/hooks/useRedux";

const AuthForm = lazy(() => import('../components/authForm/AuthForm'))

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
                <Route path="*" element={<Navigate to={UserRoutes[0]?.path || "/"}/>}/>
            </Route>
        </Routes>
    )
}

export default AppRouter