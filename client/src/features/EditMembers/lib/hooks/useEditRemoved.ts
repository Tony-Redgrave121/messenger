import {useRef} from "react";
import {useSearch}from "@shared/lib";
import {ContactSchema} from "@entities/Contact";

const useEditRemoved = (removed: ContactSchema[]) => {
    const refForm = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const {filteredArr, handleInput, filter} = useSearch(removed, 'user_id')

    return {
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter
    }
}

export default useEditRemoved