import { AppDispatch } from '@app/providers/StoreProvider/config/store';
import deleteContactApi from '@widgets/Header/api/deleteContactApi';
import { deleteContact } from '@entities/Contact';

const deleteMyContact = async (
    userId: string,
    messengerId: string,
    signal: AbortSignal,
    dispatch: AppDispatch,
) => {
    try {
        const res = await deleteContactApi(userId, messengerId, signal);

        if (res.status === 200) dispatch(deleteContact(messengerId));
    } catch (error) {
        console.log(error);
    }
};

export default deleteMyContact;
