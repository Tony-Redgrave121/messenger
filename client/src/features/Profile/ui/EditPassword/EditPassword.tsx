import React, { Dispatch, FC, RefObject, SetStateAction, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css';
import style from './style.module.css';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi2';
import { Caption } from '@shared/ui/Caption';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector, closeForm } from '@shared/lib';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';
import { TopBar } from '@shared/ui/TopBar';
import { Sidebar } from '@shared/ui/Sidebar';
import { ToggleState } from '@shared/types';
import EditPasswordSchema from '../../model/types/EditPasswordSchema';
import putPasswordApi from '../../api/putPasswordApi';
import ProfileKeys from '../../model/types/ProfileKeys';
import { setPopupChildren, setPopupState } from '../../../PopupMessage/model/slice/popupSlice';

interface IEditPasswordProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<ProfileKeys>>>;
    refSidebar: RefObject<HTMLDivElement | null>;
}

const InitialValues: EditPasswordSchema = {
    user_id: '',
    user_password: '',
    user_password_new: '',
};

const EditPassword: FC<IEditPasswordProps> = ({ state, setState, refSidebar }) => {
    const refForm = useRef<HTMLDivElement>(null);
    const { userId } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const handleChange: SubmitHandler<EditPasswordSchema> = async data => {
        try {
            const formData = new FormData();

            formData.append('user_id', userId);
            formData.append('user_password', data.user_password);
            formData.append('user_password_new', data.user_password_new);

            const newData = await putPasswordApi(userId, formData);

            dispatch(setPopupState(true));
            dispatch(setPopupChildren(newData.data.message));

            if (newData.data.status === 200) closeForm('password', setState);
        } catch (error) {
            console.log(error);
        }
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm({ defaultValues: InitialValues });

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
                                {...register('user_password', {
                                    required: 'Current password is required',
                                    pattern: {
                                        value: /^.{8,}$/,
                                        message: 'Password must be at least 8 characters long',
                                    },
                                })}
                            />
                        </FormInput>
                        <FormInput errors={errors} field="user_password_new">
                            <input
                                type="password"
                                id="user_password_new"
                                placeholder="New Password"
                                {...register('user_password_new', {
                                    required: 'New password is required',
                                    pattern: {
                                        value: /^.{8,}$/,
                                        message: 'Password must be at least 8 characters long',
                                    },
                                    validate: value =>
                                        value !== watch('user_password') ||
                                        'New password must be different',
                                })}
                            />
                        </FormInput>
                    </div>
                    <Caption>
                        Use at least 8 characters with a mix of letters, numbers, and symbols to
                        increase password strength
                    </Caption>
                    <CreateButton
                        state={watch('user_password') !== '' && watch('user_password_new') !== ''}
                        foo={handleSubmit(handleChange)}
                    >
                        <HiOutlineCheck />
                    </CreateButton>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditPassword;
