import React, { Dispatch, FC, memo, SetStateAction, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    HiOutlineArrowLeft,
    HiOutlineArrowRightOnRectangle,
    HiOutlinePencil,
} from 'react-icons/hi2';
import { logout } from '@entities/User';
import { openForm, useAppDispatch } from '@shared/lib';
import { DefaultButton, Popup, PopupConfirmation, TopBar } from '@shared/ui';

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
    const [popup, setPopup] = useState(false);

    return (
        <TopBar>
            <span>
                <DefaultButton foo={() => setState(false)} ariaLabel="Back">
                    <HiOutlineArrowLeft />
                </DefaultButton>
                <p>Settings</p>
            </span>
            <span>
                <DefaultButton
                    foo={() => openForm('profile', setFormsState)}
                    ariaLabel="Open Profile"
                >
                    <HiOutlinePencil />
                </DefaultButton>
                <DefaultButton
                    foo={() => setPopup(prev => !prev)}
                    ariaLabel="Open the drop-down menu"
                >
                    <HiOutlineArrowRightOnRectangle />
                </DefaultButton>
            </span>
            {createPortal(
                <Popup state={popup} handleCancel={() => setPopup(false)}>
                    <PopupConfirmation
                        title="Log out"
                        text="Are you sure you want to log out?"
                        confirmButtonText="log out"
                        onCancel={() => setPopup(false)}
                        onConfirm={() => dispatch(logout())}
                    />
                </Popup>,
                document.body,
            )}
        </TopBar>
    );
});

ProfileTopBar.displayName = 'ProfileTopBar';

export default ProfileTopBar;
