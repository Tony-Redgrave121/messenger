import { clsx } from 'clsx';
import { memo, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiEllipsisVertical, HiOutlineArrowLeft } from 'react-icons/hi2';
import getHeaderDesc from '@widgets/Header/lib/getHeaderDesc';
import getImagePath from '@widgets/Header/lib/getImagePath';
import HeaderDropDown from '@widgets/Header/ui/MessengerHeader/HeaderDropDown';
import { useFetchInitialData } from '@features/EditMessenger';
import { SearchMessage } from '@features/SearchMessage';
import { setSidebarLeft, setSidebarRight } from '@entities/Messenger';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { DefaultButton, LoadFile } from '@shared/ui';
import style from '../header.module.css';

const MessengerHeader = memo(() => {
    const [settings, setSettings] = useState(false);
    const [inputState, setInputState] = useState(false);

    const sidebarLeft = useAppSelector(state => state.sidebar.sidebarLeft);
    const dispatch = useAppDispatch();
    const { messenger } = useFetchInitialData();

    return (
        <header className={clsx(style.ChatHeader, style.MainHeader)}>
            <DefaultButton foo={() => dispatch(setSidebarLeft(!sidebarLeft))}>
                <HiOutlineArrowLeft />
            </DefaultButton>
            <button className={style.DeskBlock} onClick={() => dispatch(setSidebarRight(true))}>
                <LoadFile
                    imagePath={getImagePath(messenger)}
                    imageTitle={messenger.name}
                    key={messenger.id}
                />
                <div>
                    <h3>{messenger.name}</h3>
                    <p>{getHeaderDesc(messenger)}</p>
                </div>
            </button>
            <SearchMessage messenger={messenger} state={inputState} setState={setInputState} />
            <span>
                <DefaultButton foo={() => setInputState(true)}>
                    <HiOutlineMagnifyingGlass />
                </DefaultButton>
                <DefaultButton foo={() => setSettings(prev => !prev)}>
                    <HiEllipsisVertical />
                    <HeaderDropDown
                        messenger={messenger}
                        settings={settings}
                        setSettings={setSettings}
                    />
                </DefaultButton>
            </span>
        </header>
    );
});

MessengerHeader.displayName = 'MessengerHeader';

export default MessengerHeader;
