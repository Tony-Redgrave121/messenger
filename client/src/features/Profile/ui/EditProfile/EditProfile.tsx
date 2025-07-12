import React, { Dispatch, FC, RefObject, SetStateAction, useRef } from 'react';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css';
import useEditProfile from '@features/Profile/lib/hooks/useEditProfile';
import { closeForm } from '@shared/lib';
import { ToggleState } from '@shared/types';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { FileInput, FormInput } from '@shared/ui/Input';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import ProfileKeys from '../../model/types/ProfileKeys';
import style from './style.module.css';

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
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['LeftSidebarContainer', 'LeftSidebarContainerSettings']}
                ref={refSidebar}
            >
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('profile', setState)}>
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
                    <CreateButton state={isValid} foo={handleSubmit(handleChange)}>
                        <HiOutlineCheck />
                    </CreateButton>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditProfile;
