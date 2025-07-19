import { AppDispatch } from '@app/providers/StoreProvider/config/store';
import postContactApi from '@widgets/Header/api/postContactApi';
import { addContact } from '@entities/Contact';

const addNewContact = async (
    userId: string,
    messengerId: string,
    signal: AbortSignal,
    dispatch: AppDispatch,
) => {
    try {
        const newContact = await postContactApi(userId, messengerId, signal);

        if (newContact.status === 200) dispatch(addContact(newContact.data));
    } catch (error) {
        console.log(error);
    }
};

export default addNewContact;
