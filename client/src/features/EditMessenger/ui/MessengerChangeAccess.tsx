import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import { HiOutlineShieldCheck, HiOutlineUserMinus, HiOutlineUsers } from 'react-icons/hi2';
import EditFormKeys from '@features/EditMessenger/model/types/EditFormKeys';
import style from '@features/EditMessenger/ui/style.module.css';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { openForm } from '@shared/lib';
import { SettingButton } from '@shared/ui/Button';

interface IMessengerChangeAccessProps {
    setEditForm: Dispatch<SetStateAction<EditFormKeys>>;
    settings: MessengerSettingsSchema;
}

const MessengerChangeAccess: FC<IMessengerChangeAccessProps> = memo(({ setEditForm, settings }) => {
    return (
        <div className={style.Form}>
            <SettingButton
                foo={() => openForm('moderators', setEditForm)}
                text={'Moderators'}
                desc={settings.moderators.length}
            >
                <HiOutlineShieldCheck />
            </SettingButton>
            <SettingButton
                foo={() => openForm('subscribers', setEditForm)}
                text={'Subscribers'}
                desc={settings.members.length}
            >
                <HiOutlineUsers />
            </SettingButton>
            <SettingButton
                foo={() => openForm('removedUsers', setEditForm)}
                text={'Removed users'}
                desc={
                    settings.removed_users.length
                        ? settings.removed_users.length
                        : 'No removed users'
                }
            >
                <HiOutlineUserMinus />
            </SettingButton>
        </div>
    );
});

MessengerChangeAccess.displayName = 'MessengerChangeAccess';

export default MessengerChangeAccess;
