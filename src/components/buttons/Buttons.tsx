import React from 'react';
import style from './style.module.css'

interface DefaultButton {
    children?: React.ReactNode
}

namespace Buttons {
    export const DefaultButton: React.FC<DefaultButton> = ({children}) => {
        return (
            <button className={style.DefaultButton}>{children}</button>
        )
    }
}

export default Buttons