import React, {Dispatch, FC, RefObject, SetStateAction, useCallback, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "../../../index";
import {CSSTransition} from "react-transition-group";
import {IAnimationState, IMessengerSettings, IReaction, IToggleState, SettingsKeys} from "@appTypes";
import style from "./style.module.css";
import Caption from "@components/caption/Caption";
import {Buttons} from "@components/buttons";
import {HiOutlineArrowLeft} from "react-icons/hi2";
import closeForm from "@utils/logic/closeForm";
import useSettingsAnimation from "@hooks/useSettingsAnimation";
import debounce from "debounce";
import MessageService from "@service/MessageService";
import MessengerManagementService from "@service/MessengerManagementService";
import {useAbortController} from "@hooks/useAbortController";

interface IEditReactionsProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IToggleState<SettingsKeys>>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    channelReactions: IReaction[],
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
    const [animation, setAnimation] = useState(false)
    const [newReactions, setNewReactions] = useState<string[]>([])
    const [reactions, setReactions] = useState<IReaction[]>([])
    const {getSignal} = useAbortController()

    const refForm = useRef<HTMLDivElement>(null)
    useSettingsAnimation(state.state, setAnimation, setState, 'reactions')

    useEffect(() => {
        setNewReactions(channelReactions.flatMap(el => el.reaction_id))
    }, [])

    useEffect(() => {
        const signal = getSignal()

        const fetchReactions = async () => {
            MessengerManagementService.getReactions(undefined, signal)
                .then(res => {
                    console.log(res.data);
                    return res.data
                })
                .then(data => setReactions(data))
                .catch(e => console.log(e))
        }

        fetchReactions().catch(e => console.log(e))
    }, [])

    const debounceHandleReactions = useCallback(debounce(async (reactions) => {
        if (!messengerSettingsId) return

        try {
            const updatedReactions = await MessageService.postMessengerReactions(messengerSettingsId, reactions)

            setSettings(prev => ({
                ...prev,
                reactions: updatedReactions.data,
            }))
        } catch (error) {
            console.error(error)
        }
    }, 1500), [messengerSettingsId])

    useEffect(() => {
        animation && debounceHandleReactions(newReactions)
    }, [debounceHandleReactions, newReactions])

    return (
        <CSSTransition
            in={animation}
            nodeRef={refSidebar}
            timeout={300}
            classNames='left-sidebar-node'
            unmountOnExit
        >
            <SidebarContainer styles={['RightSidebarContainer', 'RightSidebarContainerEdit']} ref={refSidebar}>
                <TopBar>
                    <span>
                        <Buttons.DefaultButton foo={() => closeForm('reactions', setState)}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Reactions</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <Buttons.SwitchSettingButton
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
                            <Buttons.SwitchSettingButton
                                text={reaction.reaction_name}
                                foo={() => {
                                    if (newReactions.includes(reaction.reaction_id))
                                        setNewReactions(prev => [...prev.filter(el => el !== reaction.reaction_id)])
                                    else setNewReactions(prev => [...prev, reaction.reaction_id])
                                }}
                                state={newReactions.includes(reaction.reaction_id)}
                                key={reaction.reaction_id}>
                                <span>{reaction.reaction_code}</span>
                            </Buttons.SwitchSettingButton>
                        )}
                    </div>
                </div>
                <Caption/>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditReactions