import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@shared/lib';
import { ContactSchema } from '@entities/Contact';

const useEditModerators = (moderators: ContactSchema[]) => {
    const [newMembers, setNewMembers] = useState<ContactSchema[]>([]);

    const refForm = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const { filteredArr, handleInput, filter } = useSearch<ContactSchema, 'user_name'>(
        moderators,
        'user_name',
    );

    useEffect(() => {
        setNewMembers(moderators);
    }, [moderators]);

    return {
        newMembers,
        setNewMembers,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter,
    };
};

export default useEditModerators;
