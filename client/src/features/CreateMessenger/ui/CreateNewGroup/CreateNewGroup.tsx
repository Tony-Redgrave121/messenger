import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import { Controller } from 'react-hook-form';
import { HiOutlinePhoto } from 'react-icons/hi2';
import useMessengerCreation from '@features/CreateMessenger/lib/hooks/useMessengerCreation';
import { MessengerCreationSchema } from '@features/CreateMessenger/model/types/MessengerCreationSchema';
import SubmitButton from '@features/CreateMessenger/ui/SubmitButton/SubmitButton';
import { AddContact } from '@entities/Contact';
import { useAppSelector } from '@shared/lib';
import { FormInput } from '@shared/ui/Input';
import style from '../style.module.css';

interface IMessengerProps {
    messengerCreation: MessengerCreationSchema;
    setMessengerCreation: Dispatch<SetStateAction<MessengerCreationSchema>>;
    setAnimationState: Dispatch<SetStateAction<boolean>>;
}

const CreateMessenger: FC<IMessengerProps> = memo(
    ({ messengerCreation, setMessengerCreation, setAnimationState }) => {
        const contacts = useAppSelector(state => state.contact.contacts);

        const {
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
        } = useMessengerCreation(messengerCreation, setMessengerCreation, setAnimationState);

        return (
            <>
                <form noValidate className={style.MessengerForm} ref={refForm}>
                    <div className={style.FileBlock}>
                        <Controller
                            control={control}
                            name="messenger_image"
                            render={({ field: { onChange } }) => (
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    id="messenger_img"
                                    onChange={event =>
                                        handleImageChange(event.currentTarget.files, onChange)
                                    }
                                />
                            )}
                        />
                        <label htmlFor="messenger_img">
                            {picture ? (
                                <img
                                    src={URL.createObjectURL(picture)}
                                    alt={messengerCreation.type}
                                />
                            ) : (
                                <div>
                                    <HiOutlinePhoto />
                                </div>
                            )}
                        </label>
                    </div>
                    <FormInput errors={errors} field={'messenger_name'}>
                        <input
                            type="text"
                            id="messenger_name"
                            placeholder={'Group name'}
                            {...register('messenger_name', fieldOptions.messenger_name)}
                        />
                    </FormInput>
                    {members && contacts.length > 0 && (
                        <AddContact members={members} setMembers={setMembers} />
                    )}
                </form>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    handleCreation={handleCreation}
                    control={control}
                />
            </>
        );
    },
);

CreateMessenger.displayName = 'CreateMessenger';

export default CreateMessenger;
