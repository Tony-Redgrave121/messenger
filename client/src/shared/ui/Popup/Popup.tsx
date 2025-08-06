import { clsx } from 'clsx';
import { FC, ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { StopPropagationWrapper } from '@shared/ui';
import style from './style.module.css';
import './popup.animation.css';

interface IPopupProps {
    state: boolean;
    handleCancel: () => void;
    children?: ReactNode;
    isMessage?: boolean;
}

const Popup: FC<IPopupProps> = ({ state, handleCancel, children, isMessage }) => {
    const popupRef = useRef<HTMLDivElement | null>(null);

    return (
        <CSSTransition
            in={state}
            nodeRef={popupRef}
            timeout={300}
            classNames="popup-node"
            unmountOnExit
        >
            <div
                className={clsx(isMessage ? style.PopupMessage : style.Popup)}
                ref={popupRef}
                onClick={handleCancel}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') handleCancel();
                }}
                role="button"
                tabIndex={0}
            >
                <StopPropagationWrapper>{children}</StopPropagationWrapper>
            </div>
        </CSSTransition>
    );
};

export default Popup;
