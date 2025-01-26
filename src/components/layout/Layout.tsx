import React, {lazy, Suspense} from 'react'
import MainContainer from "../main/mainContainer/MainContainer";
import {Outlet} from "react-router-dom";
import style from './style.module.css'
import LeftSidebar from "../sidebar/leftSidebar/LeftSidebar";

const Layout = () => {
    return (
        <div className={style.LayoutContainer}>
            <div className={style.Layout}>
                <LeftSidebar/>
                <MainContainer>
                    <Outlet/>
                </MainContainer>
            </div>
        </div>
    )
}

export default Layout