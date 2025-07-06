import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useSearch } from '@shared/lib';
import { ToggleState } from '@shared/types';
import { ContactSchema } from '@entities/Contact';
import MessengerSettingsKeys from '@entities/Messenger/model/types/MessengerSettingsKeys';

const useEditSubscribers = (
    state: boolean,
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>,
    members: ContactSchema[],
) => {
    const refForm = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { filteredArr, handleInput, filter } = useSearch<ContactSchema, 'user_name'>(
        members,
        'user_name',
    );

    return {
        state,
        refForm,
        searchRef,
        filteredArr,
        handleInput,
        filter,
    };
};

export default useEditSubscribers;
