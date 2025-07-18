import { setPopupChildren, setPopupState } from '@entities/Message/model/slice/popupSlice';
import { useAppDispatch } from '@shared/lib';

const useCopy = () => {
    const dispatch = useAppDispatch();

    const copyFallback = (toCopy: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = toCopy;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
        } catch (e) {
            console.log(e);
        }

        document.body.removeChild(textarea);
    };

    const handleCopy = async (toCopy: string, popupMessage: string) => {
        if (navigator.clipboard) navigator.clipboard.writeText(toCopy);
        else copyFallback(toCopy);

        dispatch(setPopupState(true));
        dispatch(setPopupChildren(popupMessage));
    };

    return {
        handleCopy,
    };
};

export default useCopy;
