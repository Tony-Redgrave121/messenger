import React, { Dispatch, FC, SetStateAction, useRef } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import useEditMessenger from '@features/EditMessenger/lib/hooks/useEditMessenger';
import EditMessengerForm from '@features/EditMessenger/ui/EditMessengerForm';
import MessengerChangeAccess from '@features/EditMessenger/ui/MessengerChangeAccess';
import MessengerChangePrivacy from '@features/EditMessenger/ui/MessengerChangePrivacy';
import MessengerChangeState from '@features/EditMessenger/ui/MessengerChangeState';
import MessengerSettingsEditor from '@features/EditMessenger/ui/MessengerSettingsEditor';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';
import { DefaultButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import style from './style.module.css';

interface IEditMessengerProps {
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
    setEntity: Dispatch<SetStateAction<AdaptMessengerSchema>>;
}

const EditMessenger: FC<IEditMessengerProps> = ({ state, setState }) => {
    const refEditMessenger = useRef<HTMLDivElement>(null);
    const refForm = useRef<HTMLDivElement>(null);

    const { isLoaded, setIsLoaded, settings, setSettings, editForm, setEditForm, pictureRef } =
        useEditMessenger(state);

    return (
        <CSSTransition
            in={isLoaded && state}
            nodeRef={refEditMessenger}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refEditMessenger}
            >
                <TopBar>
                    <span>
                        <DefaultButton
                            foo={() => {
                                setState(false);
                                setIsLoaded(false);
                            }}
                        >
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Edit</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <EditMessengerForm
                        pictureRef={pictureRef}
                        setSettings={setSettings}
                        setState={setState}
                        setIsLoaded={setIsLoaded}
                        settings={settings}
                    />
                    <Caption>
                        You can provide an optional description for your{' '}
                        {settings.messenger_type === 'group' ? 'group' : 'channel'}.
                    </Caption>
                    <MessengerChangePrivacy setEditForm={setEditForm} settings={settings} />
                    <Caption>
                        {settings.messenger_type !== 'group'
                            ? 'Add a channel chat for comments.'
                            : ''}
                    </Caption>
                    <MessengerChangeAccess setEditForm={setEditForm} settings={settings} />
                    <Caption>
                        {settings.messenger_type !== 'group'
                            ? 'You can control access to the channel.'
                            : ''}
                    </Caption>
                    <MessengerChangeState settings={settings} />
                    <Caption />
                </div>
                <MessengerSettingsEditor
                    editForm={editForm}
                    setEditForm={setEditForm}
                    settings={settings}
                    setSettings={setSettings}
                />
            </Sidebar>
        </CSSTransition>
    );
};

export default EditMessenger;
