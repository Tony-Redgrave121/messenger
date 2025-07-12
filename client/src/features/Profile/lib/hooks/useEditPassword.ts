import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { setPopupChildren, setPopupState } from '@features/PopupMessage/model/slice/popupSlice';
import putPasswordApi from '@features/Profile/api/putPasswordApi';
import EditPasswordSchema from '@features/Profile/model/types/EditPasswordSchema';
import ProfileKeys from '@features/Profile/model/types/ProfileKeys';
import { closeForm, useAppDispatch, useAppSelector } from '@shared/lib';
import { ToggleState } from '@shared/types';

const InitialValues: EditPasswordSchema = {
    user_id: '',
    user_password: '',
    user_password_new: '',
};

const useEditPassword = (setState: Dispatch<SetStateAction<ToggleState<ProfileKeys>>>) => {
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
        control,
    } = useForm({ defaultValues: InitialValues });

    const validatedRegister = {
        user_password: register('user_password', {
            required: 'Current password is required',
            pattern: {
                value: /^.{8,}$/,
                message: 'Password must be at least 8 characters',
            },
        }),
        user_password_new: register('user_password_new', {
            required: 'New password is required',
            pattern: {
                value: /^.{8,}$/,
                message: 'Password must be at least 8 characters',
            },
            validate: value => value !== userPassword || 'New password must differ from current',
        }),
    };

    const userPassword = useWatch({ control, name: 'user_password' });
    const userPasswordNew = useWatch({ control, name: 'user_password_new' });
    const isValid = userPassword !== '' && userPasswordNew !== '';

    return {
        handleChange,
        handleSubmit,
        register: validatedRegister,
        errors,
        isValid,
    };
};
export default useEditPassword;
