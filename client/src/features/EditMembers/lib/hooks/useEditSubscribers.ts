import { useRef } from 'react';
import { useSearch } from '@shared/lib';
import { ContactSchema } from '@shared/types';

const useEditSubscribers = (members: ContactSchema[]) => {
    const refForm = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { filteredArr, handleInput, filter } = useSearch<ContactSchema, 'user_name'>(
        members,
        'user_name',
    );

    return {
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter,
    };
};

export default useEditSubscribers;
