import { useEffect } from 'react';
import getContactsApi from '@widgets/LeftSidebar/api/getContactsApi';
import { setContacts } from '@entities/Contact';
import { useAppDispatch, useAppSelector, useAbortController } from '@shared/lib';

const useGetContacts = () => {
    const userId = useAppSelector(state => state.user.userId);
    const dispatch = useAppDispatch();
    const { getSignal } = useAbortController();

    useEffect(() => {
        const signal = getSignal();

        const getContacts = async () => {
            try {
                const contacts = await getContactsApi(userId, signal);

                if (contacts.status === 200) {
                    dispatch(setContacts(contacts.data));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getContacts();
    }, []);
};

export default useGetContacts;
