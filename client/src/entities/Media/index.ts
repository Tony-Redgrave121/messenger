export { default as SliderMedia } from '@entities/Media/ui/SliderMedia/SliderMedia';
export { default as MessageMedia } from '@entities/Media/ui/MessageMedia/MessageMedia';
export { default as PreviewMedia } from '@entities/Media/ui/PreviewMedia/PreviewMedia';
export { default as UploadMedia } from '@entities/Media/ui/UploadMedia/UploadMedia';
export { default as UploadDocument } from '@entities/Media/ui/UploadDocument/UploadDocument';
export { default as MessageMediaBlock } from '@entities/Media/ui/MessageMediaBlock/MessageMediaBlock';
export { default as ImageBlock } from '@entities/Media/ui/ImageBlock/ImageBlock';

export { setVolume, setCurrVideo } from './model/slice/videoSlice';
export {
    setCurrentSlide,
    setMessageId,
    setState,
    setSlideNumber,
    setZoom,
} from './model/slice/sliderSlice';

export { IS_VIDEO } from './consts/isVideo';
