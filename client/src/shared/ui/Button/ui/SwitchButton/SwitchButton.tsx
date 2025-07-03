import {FC} from 'react'
import switchButtonStyle from './switch-button.module.css'
import {clsx} from "clsx";

interface ISwitchButtonProps {
    foo: () => void,
    state: boolean | number
}

const SwitchButton: FC<ISwitchButtonProps> = ({foo, state}) => {
    return (
        <div
            className={clsx(switchButtonStyle.SwitchButton, state && switchButtonStyle.SwitchButtonOn)}
            onClick={foo}>
        </div>
    )
}

export default SwitchButton