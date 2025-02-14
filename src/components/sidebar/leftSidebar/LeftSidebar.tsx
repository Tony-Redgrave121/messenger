import React, {useEffect, useRef, useState} from 'react'
import {
    HiBars3,
    HiOutlineCog8Tooth,
    HiOutlineBookmark,
    HiOutlineUsers,
    HiOutlineQuestionMarkCircle,
    HiOutlineBugAnt
} from "react-icons/hi2"
import style from './style.module.css'
import Buttons from '../../buttons/Buttons'
import SearchBlock from "../../searchBlock/SearchBlock"
import ChatList from "../../chatList/ChatList"
import DropDown from "../../dropDown/DropDown"
import SidebarContainer from "../SidebarContainer";
import {useAppDispatch, useAppSelector} from "../../../utils/hooks/useRedux";
import {CSSTransition} from "react-transition-group"
import {setSidebarLeft} from "../../../store/reducers/appReducer";
import debounce from "debounce";
import './animation.css'

const list = [
    {
        liChildren: <HiOutlineBookmark/>,
        liText: 'Saved Messages',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineUsers/>,
        liText: 'Contacts',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineCog8Tooth/>,
        liText: 'Settings',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineQuestionMarkCircle/>,
        liText: 'Messenger Features',
        liFoo: () => {
        }
    },
    {
        liChildren: <HiOutlineBugAnt/>,
        liText: 'Report Bug',
        liFoo: () => {
        }
    }
]

const LeftSidebar = () => {
    const [settings, setSettings] = useState(false)
    const refSearch = useRef<HTMLDivElement>(null)
    const refSidebar = useRef<HTMLDivElement>(null)
    const sidebarLeft = useAppSelector(state => state.app.sidebarLeft)
    const dispatch = useAppDispatch()

    const handleResize = debounce(() => {
        if (window.innerWidth >= 940) dispatch(setSidebarLeft(true))
        else dispatch(setSidebarLeft(false))
    }, 100)

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [dispatch, handleResize])

    return (
        <CSSTransition
            in={sidebarLeft}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
        >
            <SidebarContainer styles={['LeftSidebarContainer']} ref={refSidebar}>
                    <div className={style.TopBar}>
                        <Buttons.DefaultButton foo={() => setSettings(!settings)}>
                            <HiBars3/>
                            <DropDown list={list} state={settings} setState={setSettings}/>
                        </Buttons.DefaultButton>
                        <SearchBlock ref={refSearch}/>
                    </div>
                    <ChatList/>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default LeftSidebar