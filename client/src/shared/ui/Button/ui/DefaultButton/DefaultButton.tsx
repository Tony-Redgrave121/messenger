import React, {FC, ReactNode} from 'react'
import buttonStyle from '../../styles/button.module.css'

interface IDefaultButtonProps {
    children?: ReactNode,
    foo: (event?: React.MouseEvent<HTMLButtonElement>) => void
}

const DefaultButton: FC<IDefaultButtonProps> = ({children, foo}) => {
    return (
        <button className={buttonStyle.DefaultButton} onClick={foo}>{children}</button>
    )
}

export default DefaultButton