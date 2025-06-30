import React, {FC, ReactNode, useRef} from 'react'
import createButtonStyle from './create-button.module.css'
import {CSSTransition} from "react-transition-group";
import {InterButton} from "../../index";

interface ICreateButtonProps {
    foo: () => void,
    state: boolean,
    children: ReactNode,
}

const CreateButton: FC<ICreateButtonProps> = ({foo, children, state}) => {
    const refButton = useRef<HTMLButtonElement>(null)

    return (
        <CSSTransition
            in={state}
            nodeRef={refButton}
            timeout={300}
            classNames='create-button'
            unmountOnExit
        >
            <span className={createButtonStyle.CreateButton} ref={refButton}>
                <InterButton foo={foo}>
                    {children}
                </InterButton>
            </span>
        </CSSTransition>
    )
}

export default CreateButton