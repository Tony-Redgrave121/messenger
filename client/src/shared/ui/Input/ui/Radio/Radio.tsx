import { ChangeEvent, FC } from 'react';
import radioStyle from './radio.module.css';

interface IRadioProps {
    foo?: (event?: ChangeEvent<any>) => void;
    state: boolean;
    text: string | number;
    desc?: string | number;
}

const Radio: FC<IRadioProps> = ({ foo, text, desc, state }) => {
    return (
        <label className={radioStyle.Radio}>
            <input type="radio" onChange={foo} checked={state} />
            <p>
                {text} {desc?.toString && <small className={radioStyle.Desk}>{desc}</small>}
            </p>
        </label>
    );
};

export default Radio;
