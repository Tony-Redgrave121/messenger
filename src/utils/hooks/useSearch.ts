import React, {useEffect, useMemo, useState} from "react";
import debounce from "debounce";
import IContact from "../types/IContact";

const useSearch = (contacts: IContact[]) => {
    const [filteredContacts, setFilteredContacts] = useState<IContact[]>([])
    const [filter, setFilter] = useState('')

    useEffect(() => {
        setFilteredContacts(contacts)
    }, [contacts])

    const searchDebounce = useMemo(() =>
        debounce((query: string) => (
            setFilteredContacts(contacts.filter(el => el.user_name.toLowerCase().includes(query)))
        ), 200), [contacts]
    )

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value.toLowerCase()
        setFilter(query)

        searchDebounce(query)
    }

    return {
        filteredContacts,
        setFilteredContacts,
        filter,
        setFilter,
        handleInput
    }
}

export default useSearch