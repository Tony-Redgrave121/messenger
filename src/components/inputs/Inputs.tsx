import React, {FC} from 'react'
import style from "./style.module.css"

interface IRangeInput {
    min: string | number,
    max: string | number,
    value: string | number,
    foo: (value: string) => void
}

namespace Inputs {
    export const RangeInput: FC<IRangeInput> = ({min, max, value, foo}) => {
        return (
            <input type="range" min={min} max={max} value={value} onChange={(event) => foo(event.target.value)} className={style.RangeInput}/>
        )
    }
}

export default Inputs