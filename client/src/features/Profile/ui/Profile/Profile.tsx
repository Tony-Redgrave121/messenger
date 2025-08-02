import React, { Dispatch, FC, lazy, memo, SetStateAction, Suspense, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import ProfileActions from '@features/Profile/ui/Profile/ProfileActions';
import ProfileInfo from '@features/Profile/ui/Profile/ProfileInfo';
import ProfileTopBar from '@features/Profile/ui/Profile/ProfileTopBar';
import { ImageBlock } from '@entities/Media';
import { deleteAccount } from '@entities/User';
import { useAppDispatch, useAppSelector, useLoadBlob } from '@shared/lib';
import { Caption, Popup, PopupConfirmation, Sidebar } from '@shared/ui';
import '../profile.animation.css';

interface IProfileProps {
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
}

const EditProfile = lazy(() => import('../EditProfile/EditProfile'));
const EditPassword = lazy(() => import('../EditPassword/EditPassword'));

const Profile: FC<IProfileProps> = memo(({ state, setState }) => {
    const refProfile = useRef<HTMLDivElement>(null);
    const refEditProfile = useRef<HTMLDivElement>(null);

    const [popup, setPopup] = useState(false);
    const [formsState, setFormsState] = useState({
        profile: false,
        password: false,
    });

    const { userImg, userName, userId } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    return (
        <CSSTransition
            in={state}
            nodeRef={refProfile}
            timeout={300}
            classNames="profile-node"
            unmountOnExit
        >
            <Sidebar
                styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']}
                ref={refProfile}
            >
                <ProfileTopBar setState={setState} setFormsState={setFormsState} />
                <ImageBlock
                    imagePath={userImg ? `users/${userId}/avatar/${userImg}` : ''}
                    info={{
                        name: userName,
                        type: 'online',
                    }}
                />
                <ProfileInfo />
                <Caption />
                <ProfileActions setFormsState={setFormsState} setPopup={setPopup} />
                <Caption />
                <Suspense>
                    <EditProfile
                        state={formsState.profile}
                        setState={setFormsState}
                        refSidebar={refEditProfile}
                    />
                    <EditPassword
                        state={formsState.password}
                        setState={setFormsState}
                        refSidebar={refEditProfile}
                    />
                </Suspense>
                {createPortal(
                    <Popup state={popup} handleCancel={() => setPopup(false)}>
                        <PopupConfirmation
                            title="Delete Account"
                            text="Are you sure you want to permanently delete all your data?"
                            confirmButtonText="delete"
                            onCancel={() => setPopup(false)}
                            onConfirm={() => dispatch(deleteAccount({ user_id: userId }))}
                        />
                    </Popup>,
                    document.body,
                )}
            </Sidebar>
        </CSSTransition>
    );
});

Profile.displayName = 'Profile';

export default Profile;
