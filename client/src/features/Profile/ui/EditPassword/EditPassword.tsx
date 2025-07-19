import React, { Dispatch, FC, RefObject, SetStateAction, useRef } from 'react';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useEditPassword from '@features/Profile/lib/hooks/useEditPassword';
import ProfileKeys from '@features/Profile/model/types/ProfileKeys';
import { closeForm } from '@shared/lib';
import { ToggleState } from '@shared/types';
import { CreateButton, DefaultButton, Caption, FormInput, Sidebar, TopBar } from '@shared/ui';
import style from './style.module.css';
import '../profile.animation.css';

interface IEditPasswordProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<ProfileKeys>>>;
    refSidebar: RefObject<HTMLDivElement | null>;
}

const EditPassword: FC<IEditPasswordProps> = ({ state, setState, refSidebar }) => {
    const refForm = useRef<HTMLDivElement>(null);

    const { handleChange, handleSubmit, register, errors, isValid } = useEditPassword(setState);

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
                        <DefaultButton foo={() => closeForm('password', setState)}>
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Edit Password</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.TopForm}>
                        <FormInput errors={errors} field="user_password">
                            <input
                                type="password"
                                id="user_password"
                                placeholder="Current Password"
                                {...register.user_password}
                            />
                        </FormInput>
                        <FormInput errors={errors} field="user_password_new">
                            <input
                                type="password"
                                id="user_password_new"
                                placeholder="New Password"
                                {...register.user_password_new}
                            />
                        </FormInput>
                    </div>
                    <Caption>
                        Use at least 8 characters with a mix of letters, numbers, and symbols to
                        increase password strength
                    </Caption>
                    <CreateButton state={isValid} foo={handleSubmit(handleChange)}>
                        <HiOutlineCheck />
                    </CreateButton>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditPassword;
