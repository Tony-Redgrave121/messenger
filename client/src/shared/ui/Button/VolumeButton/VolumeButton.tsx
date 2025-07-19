import { FC } from 'react';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';
import { useAppSelector } from '@shared/lib/hooks/useRedux/useRedux';
import style from '../button.module.css';

interface IVolumeButtonProps {
    handleVolume?: () => void;
}

const VolumeButton: FC<IVolumeButtonProps> = ({ handleVolume }) => {
    const volume = useAppSelector(state => state.video.volume);

    return (
        <button onClick={handleVolume} className={style.PlayButtonMini}>
            {volume > 0 ? <HiMiniSpeakerWave /> : <HiMiniSpeakerXMark />}
        </button>
    );
};

export default VolumeButton;
