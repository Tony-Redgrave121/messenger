import { clsx } from 'clsx';
import React, { Dispatch, FC, SetStateAction, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import UnifiedMessengerSchema from '@features/MessengerSearch/model/types/UnifiedMessengerSchema';
import { useAppSelector, getDate } from '@shared/lib';
import { MessengerTypes } from '@shared/types';
import { ContactButton, LoadFile } from '@shared/ui';
import style from './messenger-search.module.css';
import './messenger-search.animation.css';

interface IMessengerSearchProps {
    animationState: boolean;
    active: MessengerTypes;
    setActive: Dispatch<SetStateAction<MessengerTypes>>;
    searchRes: UnifiedMessengerSchema[];
    foo?: () => void;
}

const MessengerSearch: FC<IMessengerSearchProps> = ({
    animationState,
    active,
    setActive,
    searchRes,
    foo,
}) => {
    const searchListRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const buttonsList: MessengerTypes[] = ['chat', 'group', 'channel'];
    const userId = useAppSelector(state => state.user.userId);

    const buttonOnClick = (newActive: MessengerTypes) => {
        setActive(newActive);
    };

    const handleClick = (id: string) => {
        if (userId !== id) {
            foo?.();
            navigate(`/${active}/${id}`);
        }
    };

    return (
        <CSSTransition
            in={animationState}
            nodeRef={searchListRef}
            timeout={300}
            classNames="messenger-search-node"
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
                {searchRes.length > 0 ? (
                    <div className={style.ListBlock}>
                        <p>Global search</p>
                        {searchRes.map(item => (
                            <ContactButton key={item.id} foo={() => handleClick(item.id)}>
                                <div className={style.ContactBlock}>
                                    <span>
                                        <LoadFile
                                            imagePath={
                                                item.img
                                                    ? `${active === 'chat' ? 'users' : 'messengers'}/${item.id}/${item.img}`
                                                    : ''
                                            }
                                            imageTitle={item.name}
                                        />
                                    </span>
                                    <div className={style.ContactInfo}>
                                        <h4>{item.name}</h4>
                                        <p>
                                            {!Number(item.desc)
                                                ? getDate(item.desc)
                                                : `${item.desc} ${active === 'group' ? 'members' : 'subscribers'}`}
                                        </p>
                                    </div>
                                </div>
                            </ContactButton>
                        ))}
                    </div>
                ) : (
                    <p>Nothing interesting here yet...</p>
                )}
            </div>
        </CSSTransition>
    );
};

export default MessengerSearch;
