import {Dispatch, SetStateAction, useRef, useState} from "react";
import {useSearch}from "@shared/lib";
import {SettingsKeys} from "@appTypes";
import {ToggleState} from "@shared/types";
import {ContactSchema} from "@entities/Contact";

const useEditSubscribers = (
    state: boolean,
    setState: Dispatch<SetStateAction<ToggleState<SettingsKeys>>>,
    members: ContactSchema[],
) => {

    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch<ContactSchema, 'user_name'>(members, 'user_name')

    return {
        state,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    }
}

export default useEditSubscribers