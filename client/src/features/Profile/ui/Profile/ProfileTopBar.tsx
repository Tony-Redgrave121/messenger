import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import {
    HiOutlineArrowLeft,
    HiOutlineArrowRightOnRectangle,
    HiOutlinePencil,
} from 'react-icons/hi2';
import { logout } from '@entities/User/lib/thunk/userThunk';
import { openForm, useAppDispatch } from '@shared/lib';
import { DefaultButton } from '@shared/ui/Button';
import { TopBar } from '@shared/ui/TopBar';

interface IProfileTopBarProps {
    setState: Dispatch<SetStateAction<boolean>>;
    setFormsState: Dispatch<
        SetStateAction<{
            profile: boolean;
            password: boolean;
        }>
    >;
}

const ProfileTopBar: FC<IProfileTopBarProps> = memo(({ setState, setFormsState }) => {
    const dispatch = useAppDispatch();

    return (
        <TopBar>
            <span>
                <DefaultButton foo={() => setState(false)}>
                    <HiOutlineArrowLeft />
                </DefaultButton>
                <p>Settings</p>
            </span>
            <span>
                <DefaultButton foo={() => openForm('profile', setFormsState)}>
                    <HiOutlinePencil />
                </DefaultButton>
                <DefaultButton foo={() => dispatch(logout())}>
                    <HiOutlineArrowRightOnRectangle />
                </DefaultButton>
            </span>
        </TopBar>
    );
});

ProfileTopBar.displayName = 'ProfileTopBar';

export default ProfileTopBar;
