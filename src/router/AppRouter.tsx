import React, {lazy} from 'react'
import {Navigate, Route, Routes} from "react-router-dom"
import Layout from "../components/layout/Layout"
import UserRoutes from "./UserRoutes"
import {useAppSelector} from "../utils/hooks/useRedux";

const AuthForm = lazy(() => import('../components/authForm/AuthForm'))
const NotFound = lazy(() => import('../components/notFound/NotFound'))

const AppRouter = () => {
    const isAuth = useAppSelector(state => state.user.isAuth)

    return (
        <Routes>
            <Route path="/" element={isAuth ? <Layout /> : <Navigate to="/auth" replace />}>
                {isAuth &&
                    UserRoutes.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))
                }
            </Route>
            <Route path="/auth" element={isAuth ? <Navigate to="/"/> : <AuthForm/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    )
}

export default AppRouter