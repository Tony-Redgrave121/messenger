import {Dispatch, SetStateAction, useEffect} from "react";
import {IAnimationState} from "@appTypes";

const useAnimation = (state: boolean, setAnimation: Dispatch<SetStateAction<boolean>>, setState: Dispatch<SetStateAction<IAnimationState>>) => {
    useEffect(() => {
        let timer: NodeJS.Timeout | null

        if (!state) timer = setTimeout(() => setState(prev => ({
            ...prev,
            mounted: false
        })), 300)

        setAnimation(state)

        return () => {
            timer && clearTimeout(timer)
        }
    }, [setAnimation, setState, state])
}

export default useAnimation