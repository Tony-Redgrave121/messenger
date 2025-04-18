import {IMessageFile} from "@appTypes";
import {Dispatch, RefObject, SetStateAction} from "react";

export default interface IUseSliderProps {
    mediaArr: IMessageFile[],
    setMediaArr: Dispatch<SetStateAction<IMessageFile[]>>,
    setAnimationState: Dispatch<SetStateAction<boolean>>,
    currentSlide: IMessageFile,
    animationState: boolean,
    refSwipe: RefObject<HTMLDivElement | null>
}