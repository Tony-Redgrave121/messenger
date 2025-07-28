import React, { FC, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import deleteMessengerApi from '@features/EditMessenger/api/deleteMessengerApi';
import style from '@features/EditMessenger/ui/EditMessenger/style.module.css';
import { deleteMessenger, MessengerSettingsSchema } from '@entities/Messenger';
import { useAbortController, useAppDispatch } from '@shared/lib';
import { Popup, PopupConfirmation, SettingButton } from '@shared/ui';

interface IMessengerChangeStateProps {
    settings: MessengerSettingsSchema;
}

const MessengerChangeState: FC<IMessengerChangeStateProps> = memo(({ settings }) => {
    const [popup, setPopup] = useState(false);

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
                foo={() => setPopup(prev => !prev)}
                text={`Delete ${settings.messenger_type === 'group' ? 'and Leave Group' : 'Channel'}`}
                isRed
            >
                <HiOutlineTrash />
            </SettingButton>
            {createPortal(
                <Popup state={popup} handleCancel={() => setPopup(false)}>
                    <PopupConfirmation
                        title="Delete"
                        text={`Are you sure you want to delete this ${settings.messenger_type}?`}
                        confirmButtonText="delete"
                        onCancel={() => setPopup(false)}
                        onConfirm={handleDelete}
                    />
                </Popup>,
                document.body,
            )}
        </div>
    );
});

MessengerChangeState.displayName = 'MessengerChangeState';

export default MessengerChangeState;
