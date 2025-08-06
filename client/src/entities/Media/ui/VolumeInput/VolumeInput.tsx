import { FC, RefObject } from 'react';
import { CSSTransition } from 'react-transition-group';
import useVolume from '@entities/Media/lib/hooks/useVolume';
import { VolumeButton } from '@shared/ui';
import style from './volume-input.module.css';
import './volume-input.animation.css';

interface IVolumeInputProps {
    mediaRef: RefObject<HTMLVideoElement | null>;
}

const VolumeInput: FC<IVolumeInputProps> = ({ mediaRef }) => {
    const { isEnter, setIsEnter, handleVolume, handleOnChange, inputRef, volume } =
        useVolume(mediaRef);

    return (
        <span
            className={style.VolumeBlock}
            onMouseEnter={() => setIsEnter(true)}
            onMouseLeave={() => setIsEnter(false)}
        >
            <VolumeButton handleVolume={handleVolume} />
            <CSSTransition
                timeout={200}
                classNames="volume-input-node"
                nodeRef={inputRef}
                in={isEnter}
                unmountOnExit
            >
                <input
                    min={0}
                    max={100}
                    type="range"
                    onChange={handleOnChange}
                    value={volume}
                    className={style.VolumeInput}
                    ref={inputRef}
                />
            </CSSTransition>
        </span>
    );
};

export default VolumeInput;
