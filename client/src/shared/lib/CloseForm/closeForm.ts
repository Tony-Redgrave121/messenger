import { Dispatch, SetStateAction } from 'react';
import ToggleState from '@shared/types/ToggleState';

const closeForm = <T extends string>(
    key: string,
    setFormsState: Dispatch<SetStateAction<ToggleState<T>>>,
) => {
    setFormsState(prev => ({
        ...prev,
        [key]: false,
    }));
};

export default closeForm;
