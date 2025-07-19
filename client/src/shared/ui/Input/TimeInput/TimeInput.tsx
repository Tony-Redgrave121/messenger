import { clsx } from 'clsx';
import { Dispatch, FC, RefObject, SetStateAction } from 'react';
import style from '../inputs.module.scss';
import useTime from './useTime';

interface ITimeInputProps {
    mediaRef: RefObject<HTMLVideoElement | null>;
    time: number;
    setTime: Dispatch<SetStateAction<number>>;
    duration: number;
}

const TimeInput: FC<ITimeInputProps> = ({ mediaRef, time, setTime, duration }) => {
    const { changeMediaTime, inputRef } = useTime(mediaRef, time, setTime, duration);

    return (
        <input
            min={0}
            max={duration}
            value={time}
            type="range"
            step="0.1"
            onChange={changeMediaTime}
            className={clsx(style.WideInput, style.Input)}
            ref={inputRef}
        />
    );
};

export default TimeInput;
