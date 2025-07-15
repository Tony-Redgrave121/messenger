import { ChangeEvent, FC } from 'react';
import style from './radio.module.css';

interface IRadioProps {
    foo?: (event?: ChangeEvent<HTMLInputElement>) => void;
    state: boolean;
    text: string | number;
    desc?: string | number;
}

const Radio: FC<IRadioProps> = ({ foo, text, desc, state }) => {
    return (
        <label className={style.Radio}>
            <input type="radio" onChange={foo} checked={state} />
            <p>
                {text} {desc?.toString && <small className={style.Desk}>{desc}</small>}
            </p>
        </label>
    );
};

export default Radio;
