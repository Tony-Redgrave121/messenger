import React, {useEffect, useMemo, useState} from "react";
import debounce from "debounce";
import {IContact} from "@appTypes";

const useSearch = (arr: any[], field: string) => {
    const [filteredArr, setFilteredArr] = useState<IContact[]>([])
    const [filter, setFilter] = useState('')

    useEffect(() => {
        setFilteredArr(arr)
    }, [arr])

    const searchDebounce = useMemo(() =>
        debounce((query: string) => (
            setFilteredArr(arr.filter(el => el[field].toLowerCase().includes(query)))
        ), 200), [arr, field]
    )

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase()
        setFilter(query)

        searchDebounce(query)
    }

    return {
        filteredArr,
        setFilteredArr,
        filter,
        setFilter,
        handleInput
    }
}

export default useSearch