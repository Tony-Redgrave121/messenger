import { RefObject, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setCurrentSlide, setSlideNumber, setZoom } from '@entities/Media';
import { fetchMessageApi } from '@entities/Message';
import {
    useAppDispatch,
    useAbortController,
    useAppSelector,
    getExt,
    getFileName,
    useLoadBlob,
} from '@shared/lib';
import { MessageSchema } from '@shared/types';
import useSwipe from './useSwipe';
import useZoom from './useZoom';

const initialMessage: MessageSchema = {
    message_id: '',
    message_text: '',
    message_date: new Date(),
    message_type: '',
    reply_id: '',
    user_id: '',
    messenger_id: '',
    message_files: [],
    comments_count: 0,
    reactions: [],
    user: {
        user_id: '',
        user_name: '',
        user_img: '',
    },
    reply: undefined,
};

const useSlider = (refSwipe: RefObject<HTMLDivElement | null>) => {
    const [message, setMessage] = useState<MessageSchema>(initialMessage);
    const { messengerId } = useParams();

    const dispatch = useAppDispatch();
    const { state, currentSlide, messageId, slideNumber } = useAppSelector(state => state.slider);

    const { setZoomSize, zoomSize, refZoom } = useZoom();
    const { handlePosition } = useSwipe(message, refSwipe, refZoom);

    const { load, image } = useLoadBlob(
        currentSlide.message_file_name
            ? `messengers/${currentSlide.message_file_path}/${currentSlide.message_file_name}`
            : '',
    );

    useEffect(() => {
        dispatch(setZoom(false));
    }, [dispatch, state]);

    const { getSignal } = useAbortController();

    useEffect(() => {
        if (!messageId || !messengerId) return;
        const signal = getSignal();

        const fetchMessage = async () => {
            try {
                const fetchedMessage = await fetchMessageApi(messengerId, messageId, signal);

                if (fetchedMessage.status === 200) {
                    setMessage(fetchedMessage.data);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchMessage();
    }, [messageId]);

    const swipeSlide = (side: boolean) => {
        const files = message?.message_files;
        if (!files || files.length === 0) return;

        const newSlide = side ? slideNumber + 1 : slideNumber - 1;
        const isOutOfBounds = newSlide < 0 || newSlide >= files.length;

        if (isOutOfBounds || !refSwipe.current) return;
        handlePosition(newSlide, files.length, files[newSlide].message_file_id);

        dispatch(setSlideNumber(newSlide));
        dispatch(setCurrentSlide(files[newSlide]));
    };

    const downloadMedia = () => {
        const name = getFileName(currentSlide.message_file_name);
        const ext = getExt(currentSlide.message_file_name);

        if (!name || !ext || !load) return;
        const link = document.createElement('a');

        link.href = image;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const zoomMedia = (value: number) => {
        if (refZoom.current) {
            setZoomSize(Number(value));
            refZoom.current.style.transform = `scale(${value}%)`;
            if (refZoom.current.style.transform === 'scale(1)') dispatch(setZoom(false));
        }
    };

    const shareMedia = () => {};

    const handleZoom = (side: boolean) => {
        const newZoom = side ? zoomSize - 20 : zoomSize + 20;

        if (newZoom >= 100 && newZoom <= 200) return zoomMedia(newZoom);

        if (side) zoomMedia(100);
        else zoomMedia(200);
    };

    return {
        swipeSlide,
        downloadMedia,
        zoomMedia,
        shareMedia,
        zoomSize,
        handleZoom,
        message,
    };
};

export default useSlider;
