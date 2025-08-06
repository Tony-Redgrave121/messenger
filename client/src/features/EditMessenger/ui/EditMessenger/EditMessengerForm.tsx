import React, { Dispatch, FC, memo, RefObject, SetStateAction, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiOutlineCheck } from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import putMessengerApi from '@features/EditMessenger/api/putMessengerApi';
import EditMessengerSchema from '@features/EditMessenger/model/types/EditMessengerSchema';
import style from '@features/EditMessenger/ui/EditMessenger/style.module.css';
import { MessengerSettingsSchema } from '@entities/Messenger';
import { useAbortController } from '@shared/lib';
import { CreateButton, FileInput, FormInput } from '@shared/ui';

interface IEditMessengerFormProps {
    pictureRef: RefObject<File | null>;
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
    setState: Dispatch<SetStateAction<boolean>>;
    setIsLoaded: Dispatch<SetStateAction<boolean>>;
    settings: MessengerSettingsSchema;
}

const InitialValues: EditMessengerSchema = {
    messenger_id: '',
    messenger_name: '',
    messenger_image: null,
    messenger_desc: '',
};

const EditMessengerForm: FC<IEditMessengerFormProps> = memo(
    ({ pictureRef, setSettings, setState, setIsLoaded, settings }) => {
        const { messengerId } = useParams();
        const { getSignal } = useAbortController();

        const {
            register,
            formState: { errors },
            control,
            setValue,
            watch,
            handleSubmit,
        } = useForm({ defaultValues: InitialValues });

        useEffect(() => {
            setValue('messenger_name', settings.messenger_name);
            setValue('messenger_desc', settings.messenger_desc);
        }, [setValue, settings]);

        const handleImageChange = (file: FileList | null, onChange: (value: File) => void) => {
            if (file) {
                pictureRef.current = file[0];
                onChange(file[0]);
            }
        };

        const onSubmit: SubmitHandler<EditMessengerSchema> = async data => {
            if (!messengerId) return;

            try {
                const formData = new FormData();

                formData.append('messenger_id', messengerId);
                formData.append('messenger_name', data.messenger_name);
                formData.append('messenger_image', data.messenger_image as File);
                formData.append('messenger_desc', data.messenger_desc);

                const signal = getSignal();
                const newData = await putMessengerApi(formData, signal);

                if (newData.status === 200) {
                    setSettings(prev => ({
                        ...prev,
                        messenger_name: data.messenger_name,
                        messenger_desc: data.messenger_desc,
                    }));

                    setValue('messenger_image', null);

                    setState(false);
                    setIsLoaded(false);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const isValid =
            watch('messenger_name') !== settings.messenger_name ||
            watch('messenger_desc') !== settings.messenger_desc ||
            watch('messenger_image') !== null;

        return (
            <>
                <div className={style.TopForm}>
                    <FileInput
                        name="messenger_image"
                        control={control}
                        handleImageChange={handleImageChange}
                        picture={pictureRef.current}
                    />
                    <FormInput errors={errors} field="messenger_name">
                        <input
                            type="text"
                            id="messenger_name"
                            placeholder="Channel name"
                            {...register('messenger_name', {
                                required: 'MessengerSearch name is required',
                            })}
                        />
                    </FormInput>
                    <FormInput errors={errors} field="messenger_desc">
                        <input
                            type="text"
                            id="messenger_desc"
                            placeholder="Description"
                            {...register('messenger_desc')}
                        />
                    </FormInput>
                </div>
                <CreateButton
                    state={isValid}
                    foo={handleSubmit(onSubmit)}
                    ariaLabel="Commit changes"
                >
                    <HiOutlineCheck />
                </CreateButton>
            </>
        );
    },
);

EditMessengerForm.displayName = 'EditMessengerForm';

export default EditMessengerForm;
