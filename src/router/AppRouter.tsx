import React, {lazy} from 'react'
import {Route, Routes} from "react-router-dom"
import Layout from "../components/layout/Layout"
import UserRoutes from "./UserRoutes"

const AuthForm = lazy(() => import('../components/authForm/AuthForm'))
const NotFound = lazy(() => import('../components/notFound/NotFound'))

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                {UserRoutes.map(({path, Component}) => <Route key={path} path={path} element={<Component/>}/>)}
            </Route>
            <Route path="/auth" element={<AuthForm/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    )
}

export default AppRouter