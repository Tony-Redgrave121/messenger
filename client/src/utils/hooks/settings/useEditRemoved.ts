import {Dispatch, SetStateAction, useRef, useState} from "react";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import useSearch from "@hooks/useSearch";
import {IAnimationState, IContact, IToggleState, SettingsKeys} from "@appTypes";

const useEditRemoved = (
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    removed: IContact[],
) => {
    const [animation, setAnimation] = useState(false)
    useSettingsAnimation(state.state, setAnimation, setState, 'removedUsers')

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(removed, 'user_id')

    return {
        animation,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    }
}

export default useEditRemoved