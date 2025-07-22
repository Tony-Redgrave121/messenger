import React, { Dispatch, FC, memo, SetStateAction, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactsList } from '@entities/Contact';
import { useSearch, useAppSelector } from '@shared/lib';
import { SearchBar } from '@shared/ui';

interface IMessengerProps {
    setAnimationState: Dispatch<SetStateAction<boolean>>;
}

const CreateNewChat: FC<IMessengerProps> = memo(({ setAnimationState }) => {
    const contacts = useAppSelector(state => state.contact.contacts);

    const { filteredArr, handleInput } = useSearch(contacts, 'user_name');

    const navigate = useNavigate();
    const searchRef = useRef<HTMLInputElement>(null);

    const navigateChat = (user_id: string) => {
        setAnimationState(false);

        return navigate(`/chat/${user_id}`);
    };

    return (
        <>
            <SearchBar foo={handleInput} searchRef={searchRef} />
            <ContactsList contacts={filteredArr} text="Contacts" onClick={navigateChat} />
        </>
    );
});

CreateNewChat.displayName = 'CreateNewChat';

export default CreateNewChat;
