import React, {FC, useRef, useState} from 'react'
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "./style.module.css";
import {clsx} from "clsx";
import {ContactList} from "@components/contacts";
import {useNavigate} from "react-router";

interface ISearchListProps {
    state: boolean
}

type ListKeys = 'chat' | 'group' | 'channel'

const SearchList: FC<ISearchListProps> = ({state}) => {
    const searchListRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<ListKeys>('chat')

    const buttonsList: ListKeys[] = ['chat', 'group', 'channel']
    const navigate = useNavigate()

    const buttonOnClick = (newActive: ListKeys) => {
        setActive(newActive)
    }

    const navigateChat = (user_id: string) => {
        return navigate(`/${active}/${user_id}`)
    }

    return (
        <CSSTransition
            in={state}
            nodeRef={searchListRef}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <div className={style.SearchListContainer}>
                <nav>
                    <ul>
                        {buttonsList.map(item => (
                            <li key={item}>
                                <button
                                    className={clsx(active === item && style.ActiveButton)}
                                    onClick={() => buttonOnClick(item)}
                                >
                                    {item}s
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={style.ListBlock}>
                    <p>Global search</p>
                    <ContactList
                        contacts={[]}
                        onClick={navigateChat}
                    />
                </div>
            </div>
        </CSSTransition>
    )
}

export default SearchList