import React, { FC, memo } from 'react';
import { Control, SubmitHandler, UseFormHandleSubmit, useWatch } from 'react-hook-form';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import NewMessengerSchema from '@features/CreateMessenger/model/types/NewMessengerSchema';
import { CreateButton } from '@shared/ui';

interface ISubmitButtonProps {
    control: Control<NewMessengerSchema>;
    handleSubmit: UseFormHandleSubmit<NewMessengerSchema>;
    handleCreation: SubmitHandler<NewMessengerSchema>;
}

const SubmitButton: FC<ISubmitButtonProps> = memo(({ control, handleSubmit, handleCreation }) => {
    const messengerName = useWatch({ control, name: 'messenger_name' });

    return (
        <CreateButton state={messengerName.length > 4} foo={handleSubmit(handleCreation)}>
            <HiOutlineArrowRight />
        </CreateButton>
    );
});

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;
