import React, { Dispatch, FC, RefObject, SetStateAction, useRef } from 'react';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useEditProfile from '@features/Profile/lib/hooks/useEditProfile';
import ProfileKeys from '@features/Profile/model/types/ProfileKeys';
import { closeForm } from '@shared/lib';
import { ToggleState } from '@shared/types';
import {
    CreateButton,
    DefaultButton,
    Caption,
    FileInput,
    FormInput,
    Sidebar,
    TopBar,
} from '@shared/ui';
import style from './edit-profile.module.css';
import '../profile.animation.css';

interface IProfileProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<ProfileKeys>>>;
    refSidebar: RefObject<HTMLDivElement | null>;
}

const EditProfile: FC<IProfileProps> = ({ state, setState, refSidebar }) => {
    const refForm = useRef<HTMLDivElement>(null);

    const {
        isValid,
        handleChange,
        handleImageChange,
        register,
        errors,
        handleSubmit,
        control,
        pictureRef,
    } = useEditProfile(setState);

    return (
        <CSSTransition
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames="profile-node"
            unmountOnExit
        >
            <Sidebar
                styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']}
                ref={refSidebar}
            >
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('profile', setState)} ariaLabel="Close">
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Edit Profile</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.TopForm}>
                        <FileInput
                            name="user_img"
                            control={control}
                            handleImageChange={handleImageChange}
                            picture={pictureRef.current}
                        />
                        <FormInput errors={errors} field="user_name">
                            <input
                                type="text"
                                id="user_name"
                                placeholder="User name"
                                {...register.user_name}
                            />
                        </FormInput>
                        <FormInput errors={errors} field="user_bio">
                            <input
                                type="text"
                                id="user_bio"
                                placeholder="User Bio"
                                {...register.user_bio}
                            />
                        </FormInput>
                    </div>
                    <Caption>
                        Any details such as age, occupation or city.
                        <br />
                        Example: 23 y.o. designer from San Francisco
                    </Caption>
                    <CreateButton
                        state={isValid}
                        foo={handleSubmit(handleChange)}
                        ariaLabel="Commit changes"
                    >
                        <HiOutlineCheck />
                    </CreateButton>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditProfile;
