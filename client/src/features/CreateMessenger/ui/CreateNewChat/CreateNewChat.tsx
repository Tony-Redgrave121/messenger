import React, { Dispatch, FC, memo, SetStateAction, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useCloseLeftSidebar from '@widgets/LeftSidebar/lib/hooks/useCloseLeftSidebar';
import { useAppSelector } from '@shared/lib';
import { useSearch } from '@shared/lib';
import { SearchBar } from '@shared/ui/SearchBar';
import { ContactList } from '../../../ContactList';
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css';

interface IMessengerProps {
    setAnimationState: Dispatch<SetStateAction<boolean>>;
}

const CreateMessenger: FC<IMessengerProps> = memo(({ setAnimationState }) => {
    const contacts = useAppSelector(state => state.contact.contacts);

    const { filteredArr, handleInput } = useSearch(contacts, 'user_name');

    const navigate = useNavigate();
    const searchRef = useRef<HTMLInputElement>(null);

    const { closeSidebar } = useCloseLeftSidebar();
    const navigateChat = (user_id: string) => {
        setAnimationState(false);
        closeSidebar();

        return navigate(`/chat/${user_id}`);
    };

    return (
        <>
            <SearchBar foo={handleInput} searchRef={searchRef} />
            <ContactList contacts={filteredArr} text="Contacts" onClick={navigateChat} />
        </>
    );
});

CreateMessenger.displayName = 'CreateNewChat';

export default CreateMessenger;
