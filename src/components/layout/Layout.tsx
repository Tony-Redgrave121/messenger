import React, {lazy, Suspense} from 'react'
import Sidebar from "../sidebar/Sidebar";
import MainContainer from "../main/mainContainer/MainContainer";
import {Outlet} from "react-router-dom";
import style from './style.module.css'

const Layout = () => {
    return (
        <div className={style.LayoutContainer}>
            <div className={style.Layout}>
                <Sidebar />
                <MainContainer>
                    <Outlet/>
                </MainContainer>
            </div>
        </div>
    )
}

export default Layout