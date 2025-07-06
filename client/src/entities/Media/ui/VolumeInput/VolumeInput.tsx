import { FC, RefObject } from 'react';
import inputStyle from '@shared/ui/Input/styles/inputs.module.css';
import volumeInputStyle from './volume-input.module.css';
import { CSSTransition } from 'react-transition-group';
import './volume-input.animation.css';
import useVolume from './useVolume';
import { VolumeButton } from '@shared/ui/Button';

interface IVolumeInputProps {
    mediaRef: RefObject<HTMLVideoElement | null>;
}

const VolumeInput: FC<IVolumeInputProps> = ({ mediaRef }) => {
    const { isEnter, setIsEnter, handleVolume, handleOnChange, inputRef, volume } =
        useVolume(mediaRef);

    return (
        <span
            className={volumeInputStyle.VolumeBlock}
            onMouseEnter={() => setIsEnter(true)}
            onMouseLeave={() => setIsEnter(false)}
        >
            <VolumeButton handleVolume={handleVolume} />
            <CSSTransition
                timeout={300}
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
                    className={inputStyle.Input}
                    ref={inputRef}
                />
            </CSSTransition>
        </span>
    );
};

export default VolumeInput;
