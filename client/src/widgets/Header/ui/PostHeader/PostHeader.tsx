import { memo, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineArrowLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useFetchInitialData } from '@features/EditMessenger';
import { SearchMessage } from '@features/SearchMessage';
import { setWrapperState } from '@entities/Messenger';
import { useAppDispatch } from '@shared/lib';
import { DefaultButton } from '@shared/ui';
import style from '../header.module.css';

const PostHeader = memo(() => {
    const [inputState, setInputState] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { messenger } = useFetchInitialData();

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
            <p>Comments</p>
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
