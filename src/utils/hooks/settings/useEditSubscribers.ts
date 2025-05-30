import {Dispatch, SetStateAction, useRef, useState} from "react";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import useSearch from "@hooks/useSearch";
import {IAnimationState, IContact, IToggleState, SettingsKeys} from "@appTypes";

const useEditSubscribers = (
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    members: IContact[],
) => {
    const [animation, setAnimation] = useState(false)
    useSettingsAnimation(state.state, setAnimation, setState, 'subscribers')

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch<IContact, 'user_name'>(members, 'user_name')

    return {
        animation,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    }
}

export default useEditSubscribers