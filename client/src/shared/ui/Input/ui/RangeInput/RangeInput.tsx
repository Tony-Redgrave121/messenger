import { clsx } from 'clsx';
import { FC } from 'react';
import style from '../inputs.module.css';
import rangeInputStyle from './range-input.module.css';
import useRange from './useRange';

interface IRangeInputProps {
    min: number;
    max: number;
    value: number;
    foo: (value: number) => void;
}

const RangeInput: FC<IRangeInputProps> = ({ min, max, value, foo }) => {
    const { inputRef, handleOnChange } = useRange(foo);

    return (
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleOnChange}
            className={clsx(rangeInputStyle.RangeInput, style.Input)}
            ref={inputRef}
        />
    );
};

export default RangeInput;
