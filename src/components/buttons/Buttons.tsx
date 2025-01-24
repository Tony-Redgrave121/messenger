import React from 'react';
import style from './style.module.css'

interface DefaultButton {
    children?: React.ReactNode,
    foo?: () => void
}

namespace Buttons {
    export const DefaultButton: React.FC<DefaultButton> = ({children, foo}) => {
        return (
            <button className={style.DefaultButton} onClick={foo}>{children}</button>
        )
    }
    export const InterButton: React.FC<DefaultButton> = ({children, foo}) => {
        return (
            <button className={style.InterButton} onClick={foo}>{children}</button>
        )
    }
}

export default Buttons