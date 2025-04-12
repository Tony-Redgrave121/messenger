import React, {Suspense} from 'react'
import MainContainer from "./mainContainer/MainContainer";
import {Outlet} from "react-router-dom";
import style from './style.module.css'
import LeftSidebar from "@components/sidebar/leftSidebar/LeftSidebar";

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
        </div>
    )
}

export default Layout