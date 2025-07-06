import { Dispatch, SetStateAction } from 'react';
import { ToggleState } from '../../types';

const openForm = <T extends string>(
    key: string,
    setFormsState: Dispatch<SetStateAction<ToggleState<T>>>,
) => {
    setFormsState(prev => ({
        ...prev,
        [key]: true,
    }));
};

export default openForm;
