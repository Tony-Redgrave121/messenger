import { FC } from 'react';
import buttonStyle from '../../styles/button.module.css';
import { useAppSelector } from '../../../../lib/hooks/useRedux/useRedux';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';

interface IVolumeButtonProps {
    handleVolume?: () => void;
}

const VolumeButton: FC<IVolumeButtonProps> = ({ handleVolume }) => {
    const volume = useAppSelector(state => state.video.volume);

    return (
        <button onClick={handleVolume} className={buttonStyle.PlayButtonMini}>
            {volume > 0 ? <HiMiniSpeakerWave /> : <HiMiniSpeakerXMark />}
        </button>
    );
};

export default VolumeButton;
