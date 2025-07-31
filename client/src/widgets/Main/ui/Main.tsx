import { FC, ReactNode, useEffect, useRef } from 'react';
import './main.animation.css';
import { CSSTransition } from 'react-transition-group';
import { syncNotifications } from '@entities/Messenger';
import img from '@shared/assets/images/pattern.webp';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import style from './main.module.css';

interface IMainContainerProps {
    children?: ReactNode;
}

const Main: FC<IMainContainerProps> = ({ children }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const wrapperState = useAppSelector(state => state.wrapper.wrapperState);
    const userId = useAppSelector(state => state.user.userId);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(syncNotifications({ user_id: userId }));
    }, [dispatch, userId]);

    return (
        <main style={{ backgroundImage: `url('${img}')` }} className={style.MainContainer}>
            <CSSTransition
                in={wrapperState}
                nodeRef={wrapperRef}
                timeout={300}
                classNames="wrapper-node"
                unmountOnExit
            >
                <div className={style.Wrapper} ref={wrapperRef}>
                    {children}
                </div>
            </CSSTransition>
        </main>
    );
};

export default Main;
