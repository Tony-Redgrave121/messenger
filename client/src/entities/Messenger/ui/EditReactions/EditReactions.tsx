import React, {Dispatch, FC, RefObject, SetStateAction, useCallback, useEffect, useRef, useState} from 'react'
import {CSSTransition} from "react-transition-group";
import {SettingsKeys} from "@appTypes";
import style from "./style.module.css";
import {Caption} from "@shared/ui/Caption";
import {HiOutlineArrowLeft} from "react-icons/hi2";
import debounce from "debounce";
import {useAbortController, closeForm} from "@shared/lib";
import {DefaultButton, SwitchSettingButton} from "@shared/ui/Button";
import {TopBar} from "@shared/ui/TopBar";
import {Sidebar} from "@shared/ui/Sidebar";
import {ToggleState} from "@shared/types";
import {ReactionSchema} from "@entities/Reaction";
import getReactionsApi from "@entities/Messenger/api/getReactionsApi";
import postMessengerReactionsApi from "@entities/Messenger/api/postMessengerReactionsApi";
import IMessengerSettings from "@features/EditMessenger/model/types/IMessengerSettings";

interface IEditReactionsProps {
    state: boolean,
    setState: Dispatch<SetStateAction<ToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    channelReactions: ReactionSchema[],
    messengerSettingsId: string,
    setSettings: Dispatch<SetStateAction<IMessengerSettings>>
}

const EditReactions: FC<IEditReactionsProps> = (
    {
        setState,
        refSidebar,
        state,
        channelReactions,
        messengerSettingsId,
        setSettings
    }
) => {
    const [newReactions, setNewReactions] = useState<string[]>([])
    const [reactions, setReactions] = useState<ReactionSchema[]>([])
    const {getSignal} = useAbortController()

    const refForm = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setNewReactions(channelReactions.flatMap(el => el.reaction_id))
    }, [])

    useEffect(() => {
        const signal = getSignal()

        const fetchReactions = async () => {
            getReactionsApi(undefined, signal)
                .then(res => res.data)
                .then(data => setReactions(data))
                .catch(e => console.log(e))
        }

        fetchReactions().catch(e => console.log(e))
    }, [])

    const debounceHandleReactions = useCallback(debounce(async (reactions) => {
        if (!messengerSettingsId) return

        try {
            const updatedReactions = await postMessengerReactionsApi(messengerSettingsId, reactions)

            setSettings(prev => ({
                ...prev,
                reactions: updatedReactions.data,
            }))
        } catch (error) {
            console.error(error)
        }
    }, 1500), [messengerSettingsId])

    useEffect(() => {
        state && debounceHandleReactions(newReactions)
    }, [debounceHandleReactions, newReactions])

    return (
        <CSSTransition
            in={state}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <DefaultButton foo={() => closeForm('reactions', setState)}>
                            <HiOutlineArrowLeft/>
                        </DefaultButton>
                        <p>Reactions</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <SwitchSettingButton
                            text={'Enable Reactions'}
                            foo={() => {
                                newReactions.length ?
                                    setNewReactions([]) :
                                    setNewReactions(reactions.map(reaction => reaction.reaction_id))
                            }}
                            state={newReactions.length}/>
                    </div>
                    <Caption>Allow subscribers to react to channel posts.</Caption>
                    <div className={style.ReactionsBlock}>
                        <p>Only allow these reactions</p>
                        {reactions.map(reaction =>
                            <SwitchSettingButton
                                text={reaction.reaction_name}
                                foo={() => {
                                    if (newReactions.includes(reaction.reaction_id))
                                        setNewReactions(prev => [...prev.filter(el => el !== reaction.reaction_id)])
                                    else setNewReactions(prev => [...prev, reaction.reaction_id])
                                }}
                                state={newReactions.includes(reaction.reaction_id)}
                                key={reaction.reaction_id}>
                                <span>{reaction.reaction_code}</span>
                            </SwitchSettingButton>
                        )}
                    </div>
                </div>
                <Caption/>
            </Sidebar>
        </CSSTransition>
    )
}

export default EditReactions