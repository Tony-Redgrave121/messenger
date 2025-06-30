import React, {FC, ReactNode} from 'react'
import topBarStyle from "./top-bar.module.css"

interface ITopBarProps {
    children: ReactNode
}

const TopBar: FC<ITopBarProps> = ({children}) => {
    return (
        <div className={topBarStyle.TopBar}>
            {children}
        </div>
    )
}

export default TopBar