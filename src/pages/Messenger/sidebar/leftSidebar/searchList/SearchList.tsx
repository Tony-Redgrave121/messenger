import React, {Dispatch, FC, SetStateAction, useRef} from 'react'
import {CSSTransition} from "react-transition-group";
import '../animation.css'
import style from "./style.module.css";
import contactStyles from "@components/contacts/style.module.css";
import {clsx} from "clsx";
import {useNavigate} from "react-router";
import {Buttons} from "@components/buttons";
import {IUnifiedMessenger, ListKeys} from "@appTypes";
import {LoadFile} from "@components/loadFile";
import {getDate} from "@utils/logic/getDate";
import {useAppSelector} from "@hooks/useRedux";
import useCloseLeftSidebar from "@hooks/useCloseLeftSidebar";

interface ISearchListProps {
    animationState: boolean,
    active: 'chat' | 'group' | 'channel',
    setActive: Dispatch<SetStateAction<ListKeys>>,
    searchRes: IUnifiedMessenger[],
}

const SearchList: FC<ISearchListProps> = ({animationState, active, setActive, searchRes}) => {
    const searchListRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const {closeSidebar} = useCloseLeftSidebar()

    const buttonsList: ListKeys[] = ['chat', 'group', 'channel']
    const userId = useAppSelector(state => state.user.userId)

    const buttonOnClick = (newActive: ListKeys) => {
        setActive(newActive)
    }

    const navigateMessenger = (messenger_id: string) => {
        return userId !== messenger_id && navigate(`/${active}/${messenger_id}`)
    }

    const onClick = (id: string) => {
        closeSidebar()
        navigateMessenger(id)
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
                            <Buttons.ContactButton key={item.id} foo={() => onClick(item.id)}>
                                <div className={contactStyles.ContactBlock}>
                                <span>
                                    <LoadFile
                                        imagePath={item.img ? `${active === 'chat' ? 'users' : 'messengers'}/${item.id}/${item.img}` : ''}
                                        imageTitle={item.name}
                                    />
                                </span>
                                    <div className={contactStyles.ContactInfo}>
                                        <h4>{item.name}</h4>
                                        <p>{!Number(item.desc) ? getDate(item.desc) : `${item.desc} ${active === 'group' ? 'members' : 'subscribers'}`}</p>
                                    </div>
                                </div>
                            </Buttons.ContactButton>
                        ))}
                    </div>
                }
            </div>
        </CSSTransition>
    )
}

export default SearchList