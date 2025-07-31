import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import mapNewMessengerDTO from '@features/CreateMessenger/api/mappers/mapNewMessengerDTO';
import postMessengerApi from '@features/CreateMessenger/api/postMessengerApi';
import { MessengerCreationSchema } from '@features/CreateMessenger/model/types/MessengerCreationSchema';
import NewMessengerSchema from '@features/CreateMessenger/model/types/NewMessengerSchema';
import { addMessenger, useLiveUpdatesContext } from '@entities/Messenger';
import { useAbortController, useAppDispatch, useAppSelector } from '@shared/lib';
import { ContactSchema } from '@shared/types';

const InitialValues: NewMessengerSchema = {
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
    messenger_type: '',
    messenger_members: [],
};

const useMessengerCreation = (
    messengerCreation: MessengerCreationSchema,
    setMessengerCreation: Dispatch<SetStateAction<MessengerCreationSchema>>,
    setAnimationState: Dispatch<SetStateAction<boolean>>,
) => {
    const [members, setMembers] = useState<ContactSchema[]>([]);
    const [picture, setPicture] = useState<File | null>(null);

    const refForm = useRef(null);
    const navigate = useNavigate();
    const userId = useAppSelector(state => state.user.userId);
    const dispatch = useAppDispatch();

    const { getSignal } = useAbortController();
    const { socketRef } = useLiveUpdatesContext();

    const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
        if (file) {
            setPicture(file[0]);
            onChange(file[0]);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({ defaultValues: InitialValues });

    const fieldOptions = {
        messenger_name: {
            required: `${messengerCreation.type} name is required`,
        },
    };

    const handleCreation: SubmitHandler<NewMessengerSchema> = async data => {
        if (!messengerCreation.type) return;

        try {
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('messenger_name', data.messenger_name);
            formData.append('messenger_image', data.messenger_image as File);
            formData.append('messenger_desc', data.messenger_desc);
            formData.append('messenger_type', messengerCreation.type);

            if (members)
                members.map(member => formData.append('messenger_members', member.user_id));

            const signal = getSignal();
            const newMessenger = await postMessengerApi(formData, signal);

            if (newMessenger.status === 200) {
                const newMessengerData = newMessenger.data;

                if (members) {
                    if (newMessengerData && socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(
                            JSON.stringify({
                                user_id: userId,
                                method: 'JOIN_TO_MESSENGER',
                                data: newMessengerData,
                            }),
                        );
                    }
                }

                dispatch(addMessenger(mapNewMessengerDTO(newMessengerData)));

                setAnimationState(false);
                navigate('/');

                return setMessengerCreation(prev => ({
                    ...prev,
                    state: false,
                }));
            }
        } catch (e) {
            console.log(e);
        }
    };

    return {
        members,
        setMembers,
        picture,
        refForm,
        handleImageChange,
        handleCreation,
        register,
        handleSubmit,
        errors,
        control,
        fieldOptions,
    };
};
export default useMessengerCreation;
