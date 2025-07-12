import React, { Dispatch, FC, lazy, memo, SetStateAction, Suspense, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import ProfileActions from '@features/Profile/ui/Profile/ProfileActions';
import ProfileInfo from '@features/Profile/ui/Profile/ProfileInfo';
import ProfileTopBar from '@features/Profile/ui/Profile/ProfileTopBar';
import { deleteAccount } from '@entities/User/lib/thunk/userThunk';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import useLoadBlob from '@shared/lib/hooks/useLoadBlob/useLoadBlob';
import { Caption } from '@shared/ui/Caption';
import { Popup } from '@shared/ui/Popup';
import { Sidebar } from '@shared/ui/Sidebar';
import { ImageBlock } from '../../../ImageBlock';
import PopupConfirmation from '../PopupConfirmation/PopupConfirmation';
import './profile.animation.css';

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
    const { image } = useLoadBlob(userImg ? `users/${userId}/${userImg}` : '');

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
                    image={image}
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
                <Popup state={popup} handleCancel={() => setPopup(false)}>
                    <PopupConfirmation
                        title="Delete Account"
                        text="Are you sure you want to permanently delete all your data?"
                        confirmButtonText="delete"
                        onCancel={() => setPopup(false)}
                        onConfirm={() => dispatch(deleteAccount({ user_id: userId }))}
                    />
                </Popup>
            </Sidebar>
        </CSSTransition>
    );
});

Profile.displayName = 'Profile';

export default Profile;
