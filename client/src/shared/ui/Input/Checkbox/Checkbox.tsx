import { ChangeEvent, FC, ReactNode } from 'react';
import style from './checkbox.module.css';

interface ICheckboxProps {
    children?: ReactNode;
    foo?: (event?: ChangeEvent<HTMLInputElement>) => void;
    state: boolean;
}

const Checkbox: FC<ICheckboxProps> = ({ foo, children, state }) => {
    return (
        <label className={style.Checkbox}>
            <input type="checkbox" onChange={foo} checked={state} />
            {children}
        </label>
    );
};

export default Checkbox;
