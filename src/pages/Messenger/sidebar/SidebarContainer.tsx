import React from 'react'
import style from './style.module.css'
import {getStyles} from "@utils/logic/getStyles";

interface ISidebarContainer {
    ref?: React.RefObject<HTMLDivElement | null>
    children: React.ReactNode,
    styles?: Array<string>
}

const SidebarContainer: React.FC<ISidebarContainer> = ({children, styles, ref}) => {
    return (
        <aside className={`${style.SidebarContainer} ${styles && getStyles(styles, style)} `} ref={ref}>
            <div className={style.Wrapper}>
                {children}
            </div>
        </aside>
    )
}

export default SidebarContainer