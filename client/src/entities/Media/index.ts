export { default as VolumeInput } from './ui/VolumeInput/VolumeInput';
export { default as SliderMedia } from '@entities/Media/ui/SliderMedia/SliderMedia';
export { default as MessageMedia } from '@features/MessageMediaBlock/ui/MessageMedia/MessageMedia';
export { default as PreviewMedia } from './ui/PreviewMedia/PreviewMedia';
export { default as UploadMedia } from './ui/UploadMedia/UploadMedia';
export { default as UploadDocument } from './ui/UploadDocument/UploadDocument';

export type { default as FileObjectSchema } from './model/types/FileObjectSchema';
export type { default as FileStateSchema } from './model/types/FileStateSchema';
export type { default as MessageFileSchema } from './model/types/MessageFileSchema';

export { setVolume, setCurrVideo } from './model/slice/videoSlice';

export { IS_VIDEO } from './consts/isVideo';

export { default as useShortMedia } from './lib/hooks/useShortMedia';
