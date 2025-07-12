import { FC, memo, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineArrowLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import SearchMessage from '@features/SearchMessage/ui/SearchMessage';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';
import { useAppDispatch } from '@shared/lib';
import { DefaultButton } from '@shared/ui/Button';
import { setWrapperState } from '../../Main/model/slice/wrapperSlice';
import style from './style.module.css';

interface ICommentsHeaderProps {
    commentsCount?: number;
    messenger: AdaptMessengerSchema;
}

const ChannelPostHeader: FC<ICommentsHeaderProps> = memo(({ commentsCount, messenger }) => {
    const [inputState, setInputState] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(setWrapperState(false));

        const timer = setTimeout(() => {
            navigate(`/channel/${messenger.id}`);
            dispatch(setWrapperState(true));
        }, 300);

        return () => clearTimeout(timer);
    };

    return (
        <header className={style.ChatHeader}>
            <DefaultButton foo={handleClose}>
                <HiOutlineArrowLeft />
            </DefaultButton>
            <p>{commentsCount} Comments</p>
            <SearchMessage messenger={messenger} state={inputState} setState={setInputState} />
            <span>
                <DefaultButton foo={() => setInputState(!inputState)}>
                    {inputState ? <HiOutlineXMark /> : <HiOutlineMagnifyingGlass />}
                </DefaultButton>
            </span>
        </header>
    );
});

ChannelPostHeader.displayName = 'ChannelPostHeader';

export default ChannelPostHeader;
