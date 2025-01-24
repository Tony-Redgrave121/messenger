import React from 'react'
import style from './style.module.css'
import {IconType} from "react-icons";

interface IPopup {
    list: Array<{
        liIcon: React.ReactNode,
        liText: string,
        liFoo: () => void
    }>
}

const Popup: React.FC<IPopup> = ({list}) => {
    return (
        <ul className={style.PopupContainer}>
            {
                list.map(item =>
                    <li key={item.liText} onClick={item.liFoo}>
                        {item.liIcon}
                        <h4>{item.liText}</h4>
                    </li>
                )
            }
        </ul>
    )
}

export default Popup