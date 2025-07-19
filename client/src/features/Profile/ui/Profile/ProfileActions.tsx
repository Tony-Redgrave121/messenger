import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import { HiOutlineLockClosed, HiOutlineTrash } from 'react-icons/hi2';
import { openForm } from '@shared/lib';
import { SettingButton } from '@shared/ui';
import style from './profile.module.css';

interface IInfoListProps {
    setFormsState: Dispatch<
        SetStateAction<{
            profile: boolean;
            password: boolean;
        }>
    >;
    setPopup: Dispatch<SetStateAction<boolean>>;
}

const ProfileActions: FC<IInfoListProps> = memo(({ setFormsState, setPopup }) => {
    return (
        <ul className={style.InfoList}>
            <li>
                <SettingButton
                    foo={() => openForm('password', setFormsState)}
                    text={'Edit Password'}
                >
                    <HiOutlineLockClosed />
                </SettingButton>
            </li>
            <li>
                <SettingButton foo={() => setPopup(true)} text={'Delete Account'} isRed>
                    <HiOutlineTrash />
                </SettingButton>
            </li>
        </ul>
    );
});

ProfileActions.displayName = 'ProfileActions';

export default ProfileActions;
