import {RefObject} from "react";

export const handleRangeProgress = (value: number, input: RefObject<HTMLInputElement | null>) => {
    if (!input.current) return
    input.current.style.backgroundSize = `${value}% 100%`
}