import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import useGetContacts from '@features/UserContacts/lib/hooks/useGetContacts';
import { ContactsList } from '@entities/Contact';
import { useCloseLeftSidebar } from '@entities/Messenger';
import { useAppSelector } from '@shared/lib';

const UserContacts = memo(() => {
    const contacts = useAppSelector(state => state.contact.contacts);
    const navigate = useNavigate();
    const { closeSidebar } = useCloseLeftSidebar();

    const navigateChat = useCallback(
        (userId: string) => {
            navigate(`/chat/${userId}`);
            closeSidebar();
        },
        [closeSidebar, navigate],
    );
    useGetContacts();

    return <ContactsList contacts={contacts} text="Contacts" onClick={navigateChat} />;
});

UserContacts.displayName = 'UserContacts';

export default UserContacts;
