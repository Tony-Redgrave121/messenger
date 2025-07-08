import React, { lazy, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import MessengerHeader from '@widgets/Header/ui/MessengerHeader';
import postContactsMembersApi from '@features/EditMembers/api/postContactsMembersApi';
import { InputBlock } from '@features/InputBlock';
import { Message, MessageSchema } from '@entities/Message';
import useFetchInitialData from '@entities/Messenger/lib/hooks/useFetchInitialData';
import { clearNotification } from '@entities/Messenger/lib/thunk/messengerThunk';
import { addMessenger } from '@entities/Messenger/model/slice/messengerSlice';
import checkRights from '@entities/User/lib/CheckRights/checkRights';
import isMember from '@entities/User/lib/IsMember/isMember';
import { useAppDispatch, useAppSelector } from '@shared/lib';
import { useAbortController } from '@shared/lib';
import style from './style.module.css';

const RightSidebar = lazy(() => import('@widgets/RightSidebar/ui/RightSidebar'));

const Messenger = () => {
    const [sidebarState, setSidebarState] = useState(false);
    const [buttonState, setButtonState] = useState(false);
    const [reply, setReply] = useState<MessageSchema | null>(null);

    const refEnd = useRef<HTMLDivElement>(null);
    const refRightSidebar = useRef<HTMLDivElement>(null);

    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const userId = useAppSelector(state => state.user.userId);
    const dispatch = useAppDispatch();

    const { messenger, setMessenger, reactions, messagesList, socketRef } = useFetchInitialData();

    useEffect(() => {
        const timeout = setTimeout(
            () => refEnd.current?.scrollIntoView({ behavior: 'smooth' }),
            300,
        );
        return () => clearTimeout(timeout);
    }, [messagesList]);

    const subscribeToMessenger = async () => {
        if (!messengerId) return;
        const signal = getSignal();

        const adaptMessenger = () => {
            const lastMessage = messagesList[messagesList.length - 1];

            dispatch(
                addMessenger({
                    messenger_id: messenger.id,
                    messenger_name: messenger.name,
                    messenger_image: messenger.image,
                    messenger_type: messenger.type,
                    messages: lastMessage
                        ? [
                              {
                                  message_date: lastMessage.message_date,
                                  message_text: lastMessage.message_text,
                              },
                          ]
                        : [],
                }),
            );

            return setButtonState(true);
        };

        try {
            if (messenger.type === 'chat') adaptMessenger();
            else {
                const newMembers = await postContactsMembersApi([userId], messengerId, signal);

                if (newMembers.status === 200) adaptMessenger();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (
            (messenger.type === 'chat' && messagesList.length > 0) ||
            isMember(messenger.members!, userId)
        ) {
            setButtonState(true);
        } else setButtonState(false);
    }, [messenger]);

    useEffect(() => {
        if (messengerId) dispatch(clearNotification(messengerId));
    }, [dispatch, messengerId]);

    const getMembers = () => {
        if (!messengerId) return [];

        if (messenger.type === 'chat') return [messengerId, userId];
        return messenger.members?.map(member => member.user.user_id);
    };

    return (
        <>
            <div className={style.MessengerContainer}>
                <MessengerHeader messenger={messenger} setSidebarState={setSidebarState} />
                <section className={style.MessageBlock} key={messengerId}>
                    {messagesList.map(message => (
                        <Message
                            message={message}
                            messenger={messenger}
                            key={message.message_id}
                            setReply={setReply}
                            socketRef={socketRef}
                            reactions={reactions}
                        />
                    ))}
                    <div ref={refEnd} />
                </section>
                {buttonState ? (
                    (messenger.type === 'channel'
                        ? checkRights(messenger.members!, userId)
                        : true) && (
                        <InputBlock
                            setReply={setReply}
                            reply={reply}
                            socketRef={socketRef}
                            members={getMembers()}
                        />
                    )
                ) : (
                    <button className={style.SubscribeButton} onClick={subscribeToMessenger}>
                        {messenger.type === 'chat' ? 'Start conversation' : 'Subscribe'}
                    </button>
                )}
            </div>
            <RightSidebar
                entity={messenger}
                setEntity={setMessenger}
                ref={refRightSidebar}
                state={sidebarState}
                setState={setSidebarState}
                key={messenger.id}
            />
        </>
    );
};

export default Messenger;
