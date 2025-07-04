import {lazy} from 'react'
import {Navigate, Route, Routes} from "react-router-dom"
import Layout from "@pages/Layout/Layout"
import {routerConfig} from "../index"
import {useAppSelector} from "@shared/lib";

const AuthForm = lazy(() => import('@pages/Auth/ui/AuthForm/AuthForm'))

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
                {routerConfig.map(({path, Component}) => (
                    <Route key={path} path={path} element={<Component/>}/>
                ))}
                <Route path="*" element={<Navigate to={"/"}/>}/>
            </Route>
        </Routes>
    )
}

export default AppRouter