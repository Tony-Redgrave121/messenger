import {FC} from 'react'
import rangeInputStyle from "./range-input.module.css"
import inputStyle from "../../styles/inputs.module.css"
import useRange from "./useRange";
import {clsx} from "clsx";

interface IRangeInputProps {
    min: number,
    max: number,
    value: number,
    foo: (value: number) => void
}

const RangeInput: FC<IRangeInputProps> = ({min, max, value, foo}) => {
    const {inputRef, handleOnChange} = useRange(foo)

    return (
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleOnChange}
            className={clsx(rangeInputStyle.RangeInput, inputStyle.Input)}
            ref={inputRef}
        />
    )
}

export default RangeInput