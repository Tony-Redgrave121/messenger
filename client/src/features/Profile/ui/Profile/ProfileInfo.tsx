import { memo } from 'react';
import { HiOutlineExclamationCircle, HiOutlinePaperClip, HiOutlineUser } from 'react-icons/hi2';
import useCopy from '@entities/Message/lib/hooks/useCopy';
import { useAppSelector } from '@shared/lib';
import { SettingButton } from '@shared/ui/Button';
import style from './profile.module.css';

const CLIENT_URL = process.env.VITE_CLIENT_URL;

const ProfileInfo = memo(() => {
    const { handleCopy } = useCopy();
    const { userName, userId, userBio } = useAppSelector(state => state.user);

    return (
        <ul className={style.InfoList}>
            <li>
                <SettingButton
                    foo={() => handleCopy(userName, 'Username copied to clipboard')}
                    text={userName}
                    desc={'Username'}
                >
                    <HiOutlineUser />
                </SettingButton>
            </li>
            <li>
                <SettingButton
                    foo={() =>
                        handleCopy(`${CLIENT_URL}/chat/${userId}`, 'Link copied to clipboard')
                    }
                    text={userId}
                    desc={'Link'}
                >
                    <HiOutlinePaperClip />
                </SettingButton>
            </li>
            {userBio && (
                <li>
                    <SettingButton
                        foo={() => handleCopy(userBio, 'Bio copied to clipboard')}
                        text={userBio}
                        desc={'Bio'}
                    >
                        <HiOutlineExclamationCircle />
                    </SettingButton>
                </li>
            )}
        </ul>
    );
});

ProfileInfo.displayName = 'ProfileInfo';

export default ProfileInfo;
