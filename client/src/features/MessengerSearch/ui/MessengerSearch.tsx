import React, {Dispatch, FC, SetStateAction, useRef} from 'react'
import {CSSTransition} from "react-transition-group";
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css'
import style from "./style.module.css";
import contactStyles from "@entities/Contact/ui/style.module.css";
import {clsx} from "clsx";
import {useNavigate} from "react-router";
import {LoadFile} from "@shared/ui/LoadFile";
import {useAppSelector, getDate} from "@shared/lib";
import {ContactButton} from "@shared/ui/Button";
import {ListKeys} from "@shared/types";
import UnifiedMessengerSchema from "@features/MessengerSearch/model/types/UnifiedMessengerSchema";

interface IMessengerSearchProps {
    animationState: boolean,
    active: 'chat' | 'group' | 'channel',
    setActive: Dispatch<SetStateAction<ListKeys>>,
    searchRes: UnifiedMessengerSchema[],
    foo: () => void
}

const MessengerSearch: FC<IMessengerSearchProps> = (
    {
        animationState,
        active,
        setActive,
        searchRes,
        foo
    }
) => {
    const searchListRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const buttonsList: ListKeys[] = ['chat', 'group', 'channel']
    const userId = useAppSelector(state => state.user.userId)

    const buttonOnClick = (newActive: ListKeys) => {
        setActive(newActive)
    }

    const handleClick = (id: string) => {
        if (userId !== id) {
            foo()
            navigate(`/${active}/${id}`)
        }
    }

    return (
        <CSSTransition
            in={animationState}
            nodeRef={searchListRef}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <div className={style.SearchListContainer} ref={searchListRef}>
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
                {searchRes.length > 0 &&
                    <div className={style.ListBlock}>
                        <p>Global search</p>
                        {searchRes.map(item => (
                            <ContactButton key={item.id} foo={() => handleClick(item.id)}>
                                <div className={contactStyles.ContactBlock}>
                                <span>
                                    <LoadFile
                                        imagePath={item.img ? `${active === 'chat' ? 'users' : 'messengers'}/${item.id}/${item.img}` : ''}
                                        imageTitle={item.name}
                                    />
                                </span>
                                    <div className={contactStyles.ContactInfo}>
                                        <h4>{item.name}</h4>
                                        <p>{!Number(item.desc) ?
                                            getDate(item.desc) :
                                            `${item.desc} ${active === 'group' ? 'members' : 'subscribers'}`}
                                        </p>
                                    </div>
                                </div>
                            </ContactButton>
                        ))}
                    </div>
                }
            </div>
        </CSSTransition>
    )
}

export default MessengerSearch