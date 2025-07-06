import React, { Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '@widgets/LeftSidebar/ui/LeftSidebar/left-sidebar.animation.css';
import style from './style.module.css';

import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi2';
import { Caption } from '@shared/ui/Caption';
import { FileInput, FormInput } from '@shared/ui/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector, closeForm, useAbortController } from '@shared/lib';
import { setUserName, setUserImg, setUserBio } from '@entities/User/model/slice/userSlice';
import { CreateButton, DefaultButton } from '@shared/ui/Button';
import { TopBar } from '@shared/ui/TopBar';
import { Sidebar } from '@shared/ui/Sidebar';
import { ToggleState } from '@shared/types';
import EditProfileSchema from '../../model/types/EditProfileSchema';
import getProfileApi from '../../api/getProfileApi';
import putProfileApi from '../../api/putProfileApi';
import ProfileKeys from '../../model/types/ProfileKeys';

interface IProfileProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<ProfileKeys>>>;
    refSidebar: RefObject<HTMLDivElement | null>;
}

const InitialValues: EditProfileSchema = {
    user_id: '',
    user_name: '',
    user_img: null,
    user_bio: '',
};

const EditProfile: FC<IProfileProps> = ({ state, setState, refSidebar }) => {
    const [settings, setSettings] = useState<EditProfileSchema>(InitialValues);

    const refForm = useRef<HTMLDivElement>(null);
    const pictureRef = useRef<File>(null);

    const { userId } = useAppSelector(state => state.user);

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            pictureRef.current = file[0];
            onChange(file[0]);
        }
    };

    const dispatch = useAppDispatch();
    const { getSignal } = useAbortController();

    const {
        register,
        formState: { errors },
        control,
        setValue,
        handleSubmit,
        watch,
    } = useForm({ defaultValues: InitialValues });

    useEffect(() => {
        const handleProfileSettings = async () => {
            try {
                const signal = getSignal();
                const profileSettings = await getProfileApi(userId, signal);

                if (profileSettings.status === 200) {
                    setSettings(profileSettings.data);

                    setValue('user_name', profileSettings.data.user_name);
                    setValue('user_bio', profileSettings.data.user_bio);

                    const user_img = profileSettings.data.user_img;

                    if (user_img && typeof user_img === 'string') {
                        pictureRef.current = new Blob(
                            [Uint8Array.from(atob(user_img), c => c.charCodeAt(0))],
                            { type: 'image/png' },
                        ) as File;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        handleProfileSettings();
    }, [setValue, userId]);

    const handleChange: SubmitHandler<EditProfileSchema> = async data => {
        try {
            const formData = new FormData();

            formData.append('user_id', userId);
            formData.append('user_name', data.user_name);
            formData.append('user_img', data.user_img as File);
            formData.append('user_bio', data.user_bio);

            const newData = await putProfileApi(userId, formData);

            if (newData.status === 200) {
                dispatch(setUserName(newData.data.user_name));
                dispatch(setUserBio(newData.data.user_bio));
                dispatch(setUserImg(newData.data.user_img));

                setValue('user_img', null);
                closeForm('profile', setState);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                                {...register('user_name', {
                                    required: 'User name is required',
                                })}
                            />
                        </FormInput>
                        <FormInput errors={errors} field="user_bio">
                            <input
                                type="text"
                                id="user_bio"
                                placeholder="User Bio"
                                {...register('user_bio')}
                            />
                        </FormInput>
                    </div>
                    <Caption>
                        Any details such as age, occupation or city.
                        <br />
                        Example: 23 y.o. designer from San Francisco
                    </Caption>
                    <CreateButton
                        state={
                            watch('user_name') !== settings.user_name ||
                            watch('user_bio') !== settings.user_bio ||
                            watch('user_img') !== null
                        }
                        foo={handleSubmit(handleChange)}
                    >
                        <HiOutlineCheck />
                    </CreateButton>
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditProfile;
