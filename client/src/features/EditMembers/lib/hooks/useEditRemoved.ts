import { useRef } from 'react';
import { ContactSchema } from '@entities/Contact';
import { useSearch } from '@shared/lib';

const useEditRemoved = (removed: ContactSchema[]) => {
    const refForm = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { filteredArr, handleInput, filter } = useSearch(removed, 'user_name');

    return {
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter,
    };
};

export default useEditRemoved;
