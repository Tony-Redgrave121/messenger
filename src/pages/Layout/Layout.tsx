import {Suspense} from 'react'
import MainContainer from "./mainContainer/MainContainer";
import {Outlet} from "react-router-dom";
import style from './style.module.css'
import {LeftSidebar} from "@components/sidebar";
import PopupMessage from "@components/popup/popupMessage/PopupMessage";

const Layout = () => {
    return (
        <div className={style.LayoutContainer}>
            <div className={style.Layout}>
                <Suspense fallback={<div>Loading...</div>}>
                    <LeftSidebar/>
                    <MainContainer>
                        <Outlet/>
                    </MainContainer>
                </Suspense>
            </div>
            <PopupMessage/>
        </div>
    )
}

export default Layout