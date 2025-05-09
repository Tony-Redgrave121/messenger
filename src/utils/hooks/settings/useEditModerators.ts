import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {
    IAnimationState,
    IContact,
    IToggleState,
    SettingsKeys
} from "@appTypes";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import useSearch from "@hooks/useSearch";

const useEditModerators = (
    moderators: IContact[],
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>
) => {
    const [animation, setAnimation] = useState(false)
    const [newMembers, setNewMembers] = useState<IContact[]>([])
    useSettingsAnimation(state.state, setAnimation, setState, 'moderators')

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(moderators, 'user_id')

    useEffect(() => {
        setNewMembers(moderators)
    }, [moderators])

    return {
        animation,
        newMembers,
        setNewMembers,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    }
}

export default useEditModerators