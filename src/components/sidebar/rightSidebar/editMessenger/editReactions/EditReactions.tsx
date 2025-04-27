import React, {Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState} from 'react'
import {SidebarContainer, TopBar} from "@components/sidebar";
import {CSSTransition} from "react-transition-group";
import useAnimation from "@hooks/useAnimation";
import {IAnimationState, IReaction} from "@appTypes";
import style from "./style.module.css";
import Caption from "@components/caption/Caption";
import {Buttons} from "@components/buttons";
import {HiOutlineArrowLeft} from "react-icons/hi2";
import MessengerService from "@service/MessengerService";

interface IEditReactionsProps {
    state: IAnimationState,
    setState: Dispatch<SetStateAction<IAnimationState>>,
    refSidebar: RefObject<HTMLDivElement | null>,
    channelReactions: IReaction[]
}

const EditReactions: FC<IEditReactionsProps> = ({setState, refSidebar, state, channelReactions}) => {
    const [animation, setAnimation] = useState(false)
    const [newReactions, setNewReactions] = useState<string[]>([])
    const [reactions, setReactions] = useState<IReaction[]>([])

    const refForm = useRef<HTMLDivElement>(null)

    useAnimation(state.state, setAnimation, setState)

    useEffect(() => {
        setNewReactions(channelReactions.flatMap(el => el.reaction_id))
    }, [channelReactions])

    useEffect(() => {
        const fetchReactions = async () => {
            MessengerService.getReactions()
                .then(res => res.data)
                .then(data => setReactions(data))
                .catch(e => console.log(e))
        }

        fetchReactions().catch(e => console.log(e))
    }, [])

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
                        <Buttons.DefaultButton foo={() => {
                            setState(prev => ({
                                ...prev,
                                state: false
                            }))
                        }}>
                            <HiOutlineArrowLeft/>
                        </Buttons.DefaultButton>
                        <p>Reactions</p>
                    </span>
                </TopBar>
                <div className={style.FormContainer} ref={refForm}>
                    <div>
                        <Buttons.SwitchSettingButton text={'Enable Reactions'} foo={() => newReactions.length ? setNewReactions([]) : setNewReactions(reactions.map(reaction => reaction.reaction_id))} state={newReactions.length}/>
                    </div>
                    <Caption>Allow subscribers to react to channel posts.</Caption>
                    <div className={style.ReactionsBlock}>
                        <p>Only allow these reactions</p>
                        {reactions.map(reaction =>
                            <Buttons.SwitchSettingButton text={reaction.reaction_name} foo={() => {
                                if (newReactions.includes(reaction.reaction_id)) setNewReactions(prev => [...prev.filter(el => el !== reaction.reaction_id)])
                                else setNewReactions(prev => [...prev, reaction.reaction_id])
                            }} state={newReactions.includes(reaction.reaction_id)} key={reaction.reaction_id}>
                                <span>{reaction.reaction_code}</span>
                            </Buttons.SwitchSettingButton>
                        )}
                    </div>
                </div>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default EditReactions