import { useEffect } from 'react';
import { setPopupState } from '@entities/Message/model/slice/popupSlice';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { Popup } from '@shared/ui/Popup';

const PopupMessage = () => {
    const { popupChildren, popupState } = useAppSelector(state => state.popup);
    const dispatch = useAppDispatch();

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (popupState) {
            timer = setTimeout(() => dispatch(setPopupState(false)), 3000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dispatch, popupState]);

    return (
        <Popup state={popupState} isMessage handleCancel={() => {}}>
            <p>{popupChildren}</p>
        </Popup>
    );
};

export default PopupMessage;
