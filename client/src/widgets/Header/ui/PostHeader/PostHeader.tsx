import { FC, memo, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineArrowLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { SearchMessage } from '@features/SearchMessage';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { setWrapperState } from '@entities/Messenger/model/slice/wrapperSlice';
import { useAppDispatch } from '@shared/lib';
import { DefaultButton } from '@shared/ui';
import style from '../header.module.css';

interface ICommentsHeaderProps {
    commentsCount?: number;
    messenger: AdaptMessengerSchema;
}

const PostHeader: FC<ICommentsHeaderProps> = memo(({ commentsCount, messenger }) => {
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

PostHeader.displayName = 'ChannelPostHeader';

export default PostHeader;
