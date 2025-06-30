import {ChangeEvent, FC, ReactNode} from 'react'
import checkboxStyle from "./checkbox.module.css";

interface ICheckboxProps {
    children?: ReactNode,
    foo?: (event?: ChangeEvent<any>) => void,
    state: boolean
}

const Checkbox: FC<ICheckboxProps> = ({foo, children, state}) => {
    return (
        <label className={checkboxStyle.Checkbox}>
            <input type="checkbox" onChange={foo} checked={state}/>
            {children}
        </label>
    )
}

export default Checkbox