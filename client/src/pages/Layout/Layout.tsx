import {lazy, Suspense} from 'react'
import {Outlet} from "react-router-dom";
import style from './style.module.css'
import {LeftSidebar} from "pages/Messenger/sidebar";

const MainContainer = lazy(() => import("./mainContainer/MainContainer"))
const PopupMessage = lazy(() => import("../../components/popup/popupMessage/PopupMessage"))

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
            </Suspense>
        </div>
    )
}

export default Layout