import React, {FC} from 'react'
import style from "./style.module.css"
import Buttons from "@components/buttons/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {setVolume} from "@store/reducers/sliderReducer"

interface IRangeInput {
    min: string | number,
    max: string | number,
    value: string | number,
    foo: (value: string) => void,
    className?: string,
}

interface IVolumeInput {

}

namespace Inputs {
    export const RangeInput: FC<IRangeInput> = ({min, max, value, foo, className}) => {
        return (
            <input type="range" min={min} max={max} value={value} onChange={(event) => foo(event.target.value)} className={`${style.RangeInput} ${className && style[className]}`}/>
        )
    }
    export const VolumeInput: FC<IVolumeInput> = () => {
        const volume = useAppSelector(state => state.slider.volume)
        const dispatch = useAppDispatch()

        return (
            <span className={style.VolumeBlock}>
                <Buttons.VolumeButton handleVolume={() => {}}/>
                <input min={0} max={100} type="range" onChange={event => dispatch(setVolume(event.target.value))} value={volume} className={`${style.RangeInput} ${style.WideInput}`}/>
            </span>
        )
    }
}

export default Inputs