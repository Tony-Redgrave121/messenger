import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import { HiOutlineHeart, HiOutlineLockClosed } from 'react-icons/hi2';
import EditFormKeys from '@features/EditMessenger/model/types/EditFormKeys';
import style from '@features/EditMessenger/ui/style.module.css';
import MessengerSettingsSchema from '@entities/Messenger/model/types/MessengerSettingsSchema';
import { openForm } from '@shared/lib';
import { SettingButton } from '@shared/ui/Button';

interface IMessengerChangePrivacyProps {
    setEditForm: Dispatch<SetStateAction<EditFormKeys>>;
    settings: MessengerSettingsSchema;
}

const MessengerChangePrivacy: FC<IMessengerChangePrivacyProps> = memo(
    ({ setEditForm, settings }) => {
        return (
            <div className={style.Form}>
                <SettingButton
                    foo={() => openForm('channelType', setEditForm)}
                    text={'Channel Type'}
                    desc={settings.messenger_setting_type}
                >
                    <HiOutlineLockClosed />
                </SettingButton>
                {settings.messenger_type === 'channel' && (
                    <SettingButton
                        foo={() => openForm('reactions', setEditForm)}
                        text={'Reactions'}
                        desc={
                            settings.reactions.length
                                ? `${settings.reactions.length}/${settings.reactions_count}`
                                : 'Disabled'
                        }
                    >
                        <HiOutlineHeart />
                    </SettingButton>
                )}
            </div>
        );
    },
);

MessengerChangePrivacy.displayName = 'MessengerChangePrivacy';

export default MessengerChangePrivacy;
