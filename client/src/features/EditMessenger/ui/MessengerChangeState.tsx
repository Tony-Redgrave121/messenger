import React, { FC, memo } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import deleteMessengerApi from '@features/EditMessenger/api/deleteMessengerApi';
import style from '@features/EditMessenger/ui/style.module.css';
import { deleteMessenger } from '@entities/Messenger/lib/thunk/messengerThunk';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { useAbortController, useAppDispatch } from '@shared/lib';
import { SettingButton } from '@shared/ui/Button';

interface IMessengerChangeStateProps {
    settings: MessengerSettingsSchema;
}

const MessengerChangeState: FC<IMessengerChangeStateProps> = memo(({ settings }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const handleDelete = async () => {
        if (!messengerId) return;

        try {
            const signal = getSignal();
            const res = await deleteMessengerApi(messengerId, signal);

            if (res.status === 200) {
                navigate('/');
                dispatch(deleteMessenger(messengerId));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={style.Form}>
            <SettingButton
                foo={handleDelete}
                text={`Delete ${settings.messenger_type === 'group' ? 'and Leave Group' : 'Channel'}`}
                isRed
            >
                <HiOutlineTrash />
            </SettingButton>
        </div>
    );
});

MessengerChangeState.displayName = 'MessengerChangeState';

export default MessengerChangeState;
