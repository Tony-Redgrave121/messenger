import React, { FC, memo, useState } from 'react';
import { HiOutlineBell, HiOutlineExclamationCircle, HiOutlinePaperClip } from 'react-icons/hi2';
import { useCopy } from '@entities/Message';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { SettingButton, SwitchSettingButton } from '@shared/ui/Button';
import style from './info-list.module.css';

const CLIENT_URL = process.env.VITE_CLIENT_URL;

interface IInfoListProps {
    entity: AdaptMessengerSchema;
}

const InfoList: FC<IInfoListProps> = memo(({ entity }) => {
    const [notification, setNotification] = useState(true);
    const { handleCopy } = useCopy();

    return (
        <ul className={style.InfoList}>
            {entity.desc && (
                <li>
                    <SettingButton
                        foo={() => handleCopy(entity.desc!, 'Info copied to clipboard')}
                        text={entity.desc}
                        desc={'Info'}
                    >
                        <HiOutlineExclamationCircle />
                    </SettingButton>
                </li>
            )}
            <li>
                <SettingButton
                    foo={() =>
                        handleCopy(
                            `${CLIENT_URL}/${entity.type}/${entity.id}`,
                            'Link copied to clipboard',
                        )
                    }
                    text={entity.id}
                    desc={'Link'}
                >
                    <HiOutlinePaperClip />
                </SettingButton>
            </li>
            <li>
                <SwitchSettingButton
                    text={'Notifications'}
                    foo={() => setNotification(!notification)}
                    state={notification}
                >
                    <HiOutlineBell />
                </SwitchSettingButton>
            </li>
        </ul>
    );
});

InfoList.displayName = 'InfoList';

export default InfoList;
