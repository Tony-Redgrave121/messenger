import {RefObject} from "react";

const rangeProgress = (value: number, input: RefObject<HTMLInputElement | null>) => {
    if (!input.current) return
    input.current.style.backgroundSize = `${value}% 100%`
}

export default rangeProgress