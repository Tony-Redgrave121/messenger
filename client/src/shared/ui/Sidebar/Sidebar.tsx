import {FC, ReactNode, RefObject} from 'react'
import sidebarStyle from './style.module.css'
import {getStyles} from "../../lib";
import {clsx} from "clsx";

interface ISidebarContainer {
    ref?: RefObject<HTMLDivElement | null>
    children: ReactNode,
    styles?: Array<string>
}

const Sidebar: FC<ISidebarContainer> = ({children, styles, ref}) => {
    return (
        <aside className={clsx(sidebarStyle.SidebarContainer, styles && getStyles(styles, sidebarStyle))} ref={ref}>
            <div className={sidebarStyle.Wrapper}>
                {children}
            </div>
        </aside>
    )
}

export default Sidebar