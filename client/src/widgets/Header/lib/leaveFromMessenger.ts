import { NavigateFunction } from 'react-router-dom';
import { AppDispatch } from '@app/providers/StoreProvider/config/store';
import deleteMemberApi from '@features/EditMembers/api/deleteMemberApi';
import { deleteMessenger } from '@entities/Messenger/lib/thunk/messengerThunk';

const leaveFromMessenger = async (
    userId: string,
    messengerId: string,
    signal: AbortSignal,
    dispatch: AppDispatch,
    navigate: NavigateFunction,
) => {
    try {
        const res = await deleteMemberApi(userId, messengerId, signal);

        if (res.status === 200) {
            dispatch(deleteMessenger(messengerId));
            navigate('/');
        }
    } catch (error) {
        console.log(error);
    }
};

export default leaveFromMessenger;
