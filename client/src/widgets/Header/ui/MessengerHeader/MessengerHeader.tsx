import { clsx } from 'clsx';
import { FC, memo, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiEllipsisVertical, HiOutlineArrowLeft } from 'react-icons/hi2';
import getHeaderDesc from '@widgets/Header/lib/getHeaderDesc';
import getImagePath from '@widgets/Header/lib/getImagePath';
import HeaderDropDown from '@widgets/Header/ui/MessengerHeader/HeaderDropDown';
import { SearchMessage } from '@features/SearchMessage';
import { setSidebarLeft, setSidebarRight, AdaptMessengerSchema } from '@entities/Messenger';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { DefaultButton, LoadFile } from '@shared/ui';
import style from '../header.module.css';

interface IMessengerHeaderProps {
    messenger: AdaptMessengerSchema;
}

const MessengerHeader: FC<IMessengerHeaderProps> = memo(({ messenger }) => {
    const [settings, setSettings] = useState(false);
    const [inputState, setInputState] = useState(false);

    const sidebarLeft = useAppSelector(state => state.sidebar.sidebarLeft);
    const dispatch = useAppDispatch();

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
