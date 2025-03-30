import React, {ReactNode} from 'react'
import style from "./style.module.css"

interface IImageBlockProps {
    children: ReactNode
}

const TopBar: React.FC<IImageBlockProps> = ({children}) => {
    return (
        <div className={style.TopBar}>
            {children}
        </div>
    )
}

export default TopBar