import { useEffect, useState } from 'react';
import useEditSubscribers from '@features/EditMembers/lib/hooks/useEditSubscribers';
import { ContactSchema } from '@shared/types';

const useEditModerators = (moderators: ContactSchema[]) => {
    const [newMembers, setNewMembers] = useState<ContactSchema[]>([]);
    const { refForm, searchRef, filteredArr, handleInput, filter } = useEditSubscribers(moderators);

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
