import React, { FC, ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import InterButton from '@shared/ui/Button/ui/InterButton/InterButton';
import style from './create-button.module.css';
import './create-button.animation.css';

interface ICreateButtonProps {
    foo: () => void;
    state: boolean;
    children: ReactNode;
}

const CreateButton: FC<ICreateButtonProps> = ({ foo, children, state }) => {
    const refButton = useRef<HTMLButtonElement>(null);

    return (
        <CSSTransition
            in={state}
            nodeRef={refButton}
            timeout={200}
            classNames="create-button"
            unmountOnExit
        >
            <span className={style.CreateButton} ref={refButton}>
                <InterButton foo={foo}>{children}</InterButton>
            </span>
        </CSSTransition>
    );
};

export default CreateButton;
