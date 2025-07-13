import React, { Dispatch, FC, memo, SetStateAction, useRef } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import MessengerSettingsSchema from '@features/EditMessenger/model/types/MessengerSettingsSchema';
import useEditReactions from '@entities/Messenger/lib/hooks/useEditReactions';
import MessengerSettingsKeys from '@entities/Messenger/model/types/MessengerSettingsKeys';
import { ReactionSchema } from '@entities/Reaction';
import { closeForm } from '@shared/lib';
import { ToggleState } from '@shared/types';
import { DefaultButton, SwitchSettingButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import style from './style.module.css';

interface IEditReactionsProps {
    state: boolean;
    setState: Dispatch<SetStateAction<ToggleState<MessengerSettingsKeys>>>;
    channelReactions: ReactionSchema[];
    messengerSettingsId: string;
    setSettings: Dispatch<SetStateAction<MessengerSettingsSchema>>;
}

const EditReactions: FC<IEditReactionsProps> = ({
    setState,
    state,
    channelReactions,
    messengerSettingsId,
    setSettings,
}) => {
    const refSidebar = useRef<HTMLDivElement>(null);
    const refForm = useRef<HTMLDivElement>(null);

    const { availableReactions, activeReactions, toggleAll, toggleOne } = useEditReactions(
        messengerSettingsId,
        channelReactions.map(r => r.reaction_id),
        setSettings,
        state,
    );

    const ReactionsList = memo(() => {
        return (
            <div className={style.ReactionsBlock}>
                <p>Only allow these reactions</p>
                {activeReactions.map(r => (
                    <SwitchSettingButton
                        text={r.reaction_name}
                        foo={() => toggleOne(r.reaction_id)}
                        state={availableReactions.includes(r.reaction_id)}
                        key={r.reaction_id}
                    >
                        <span>{r.reaction_code}</span>
                    </SwitchSettingButton>
                ))}
            </div>
        );
    });

    ReactionsList.displayName = 'ReactionsList';

    return (
        <CSSTransition
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames="left-sidebar-node"
            unmountOnExit
        >
            <Sidebar
                styles={['RightSidebarContainer', 'RightSidebarContainerEdit']}
                ref={refSidebar}
            >
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('reactions', setState)}>
                            <HiOutlineArrowLeft />
                        </DefaultButton>
                        <p>Reactions</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SwitchSettingButton
                            text={'Enable Reactions'}
                            foo={toggleAll}
                            state={availableReactions.length}
                        />
                    </div>
                    <Caption>Allow subscribers to react to channel posts.</Caption>
                    <ReactionsList />
                </div>
                <Caption />
            </Sidebar>
        </CSSTransition>
    );
};

export default EditReactions;
