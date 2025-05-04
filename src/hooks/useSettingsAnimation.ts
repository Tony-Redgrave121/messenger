import {Dispatch, SetStateAction, useEffect} from "react";
import {IToggleState} from "@appTypes";

const useSettingsAnimation = <T extends string>(state: boolean, setAnimation: Dispatch<SetStateAction<boolean>>, setState: Dispatch<SetStateAction<IToggleState<T>>>, key: T) => {
    useEffect(() => {
        let timer: NodeJS.Timeout | null

        if (!state) timer = setTimeout(() => setState(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                mounted: false
            }
        })), 300)

        setAnimation(state)

        return () => {
            timer && clearTimeout(timer)
        }
    }, [key, setAnimation, setState, state])
}

export default useSettingsAnimation