import { ChangeEvent, useRef } from 'react';
import { rangeProgress } from '../../../../lib';

const useRange = (foo: (value: number) => void) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const volume = Number.parseFloat(event.target.value);
        rangeProgress(volume, inputRef);
        foo(volume);
    };

    return {
        inputRef,
        handleOnChange,
    };
};

export default useRange;
