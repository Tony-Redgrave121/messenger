import {lazy, Suspense} from 'react'
import {Outlet} from "react-router-dom";
import style from './style.module.css'
import {LeftSidebar} from "../Messenger/sidebar";
import {Slider} from "@components/slider";

const MainContainer = lazy(() => import("./mainContainer/MainContainer"))
const PopupMessage = lazy(() => import("@components/popup/popupMessage/PopupMessage"))

const Layout = () => {
    return (
        <div className={style.LayoutContainer}>
            <div className={style.Layout}>
                <LeftSidebar/>
                <Suspense>
                    <MainContainer>
                        <Outlet/>
                    </MainContainer>
                </Suspense>
            </div>
            <Suspense>
                <PopupMessage/>
                <Slider/>
            </Suspense>
        </div>
    )
}

export default Layout