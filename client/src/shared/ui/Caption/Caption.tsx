import {FC, ReactNode} from 'react'
import style from './caption.module.css'

interface ICaptionProps {
    children?: ReactNode
}

const Caption: FC<ICaptionProps> = ({children}) => {
    return (
        <div className={style.CaptionBlock}>
            {children && <p>{children}</p>}
        </div>
    )
}

export default Caption