import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import getProfileApi from '@features/Profile/api/getProfileApi';
import putProfileApi from '@features/Profile/api/putProfileApi';
import EditProfileSchema from '@features/Profile/model/types/EditProfileSchema';
import ProfileKeys from '@features/Profile/model/types/ProfileKeys';
import { setUserBio, setUserImg, setUserName } from '@entities/User';
import { closeForm, useAbortController, useAppDispatch, useAppSelector } from '@shared/lib';
import { ToggleState } from '@shared/types';

const initialValues: EditProfileSchema = {
    user_id: '',
    user_name: '',
    user_img: null,
    user_bio: '',
};

const useEditProfile = (setState: Dispatch<SetStateAction<ToggleState<ProfileKeys>>>) => {
    const [initialProfile, setInitialProfile] = useState<EditProfileSchema>(initialValues);
    const pictureRef = useRef<File>(null);

    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(state => state.user);

    const { getSignal } = useAbortController();

    const {
        register,
        formState: { errors },
        control,
        setValue,
        handleSubmit,
    } = useForm({ defaultValues: initialValues });

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            pictureRef.current = file[0];
            onChange(file[0]);
        }
    };

    useEffect(() => {
        const handleProfileSettings = async () => {
            try {
                const signal = getSignal();
                const profileSettings = await getProfileApi(userId, signal);

                if (profileSettings.status === 200) {
                    setInitialProfile(profileSettings.data);

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

    const userName = useWatch({ control, name: 'user_name' });
    const userBio = useWatch({ control, name: 'user_bio' });
    const userImg = useWatch({ control, name: 'user_img' });

    const isValid =
        userName !== initialProfile.user_name ||
        userBio !== initialProfile.user_bio ||
        userImg !== null;

    const validatedRegister = {
        user_name: register('user_name', {
            required: 'User name is required',
        }),
        user_bio: register('user_bio'),
    };

    return {
        isValid,
        handleChange,
        handleImageChange,
        register: validatedRegister,
        errors,
        handleSubmit,
        control,
        pictureRef,
    };
};

export default useEditProfile;
