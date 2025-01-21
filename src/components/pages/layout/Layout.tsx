import React, {lazy, Suspense} from 'react'
import Sidebar from "../../sidebar/Sidebar";
import MainContainer from "../../main/mainContainer/MainContainer";


const Layout = () => {
    return (
        <>
            <Sidebar />
            <MainContainer />
        </>
    )
}

export default Layout