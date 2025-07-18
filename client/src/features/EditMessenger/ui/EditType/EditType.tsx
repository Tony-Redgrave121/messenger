import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import putMessengerLinkApi from '@features/EditMessenger/api/putMessengerLinkApi';
import putMessengerTypeApi from '@features/EditMessenger/api/putMessengerTypeApi';
import { useCopy } from '@entities/Message';
import { MessengerSettingsKeys } from '@entities/Messenger';
import { closeForm } from '@shared/lib';
import { ToggleState } from '@shared/types';
import { DefaultButton, SettingButton, Caption, Radio, Sidebar, TopBar } from '@shared/ui';
import style from './style.module.css';

interface IEditTypeProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>;
    messengerType: 'private' | 'public';
    messengerUrlType: string;
}

const EditType: FC<IEditTypeProps> = ({ setState, state, messengerType, messengerUrlType }) => {
    const [newMessengerType, setNewMessengerType] = useState('private');
    const [newMessengerLink, setNewMessengerLink] = useState('');

    const refForm = useRef<HTMLDivElement>(null);
    const refEditChannelType = useRef<HTMLDivElement>(null);

    const { messengerId } = useParams();
    const navigate = useNavigate();
    const { handleCopy } = useCopy();

    useEffect(() => {
        if (!messengerId) return;

        setNewMessengerType(messengerType);
        setNewMessengerLink(messengerId);
    }, [messengerType, messengerId]);

    const handleMessengerType = async (type: string) => {
        if (!newMessengerLink) return;

        try {
            await putMessengerTypeApi(type, newMessengerLink);

            setNewMessengerType(type);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRevokeLink = async () => {
        if (!newMessengerLink) return;

        try {
            const res = await putMessengerLinkApi(newMessengerLink);

            setNewMessengerLink(res.data.messenger_id);
            navigate(`/${messengerUrlType}/${res.data.messenger_id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <CSSTransition
            in={state}
            nodeRef={refEditChannelType}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refEditChannelType}
            >
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('channelType', setState)}>
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Channel Type</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div className={style.FormBlock}>
                        <p>Channel Type</p>
                        <Radio
                            key="private"
                            foo={() => handleMessengerType('private')}
                            state={newMessengerType === 'private'}
                            text="Private Channel"
                            desc="Private channels can only be joined via an invite link."
                        />
                        <Radio
                            key="public"
                            foo={() => handleMessengerType('public')}
                            state={newMessengerType === 'public'}
                            text="Public Channel"
                            desc="Public channels can be found in search, anyone can join them."
                        />
                    </div>
                    <Caption />
                    <div className={style.FormBlock}>
                        <SettingButton
                            text={window.location.href}
                            desc="People can join your channel by following this link. You can revoke the link any time."
                            foo={() => {
                                handleCopy(window.location.href, 'Link copied to clipboard');
                            }}
                        />
                        <SettingButton foo={handleRevokeLink} text="Revoke Link" isRed>
                            <HiOutlineTrash />
                        </SettingButton>
                    </div>
                    <Caption />
                </div>
            </Sidebar>
        </CSSTransition>
    );
};

export default EditType;
