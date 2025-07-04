import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom";
import {isServerError, useAppDispatch, useAppSelector} from "@shared/lib";
import {useAbortController} from "@shared/lib";
import {useMessageWS} from "../../../Message";
import {setPopupChildren, setPopupState} from "@features/PopupMessage/model/slice/popupSlice";
import {ReactionSchema} from "@entities/Reaction";
import mapMessengerDTO from "@entities/Messenger/api/mappers/mapMessengerDTO";
import AdaptMessengerSchema from "@entities/Messenger/model/types/AdaptMessengerSchema";
import fetchMessengerApi from "@entities/Messenger/api/fetchMessengerApi";
import fetchMessagesApi from "@entities/Messenger/api/fetchMessagesApi";
import getReactionsApi from "@entities/Messenger/api/getReactionsApi";

const types = ['chat', 'channel', 'group']

const InitialMessenger: AdaptMessengerSchema = {
    id: '',
    name: '',
    image: '',
    desc: '',
    type: 'chat',
    members: [],
    members_count: 0,
    last_seen: new Date(),
}

const useFetchInitialData = () => {
    const [reactions, setReactions] = useState<ReactionSchema[]>([])
    const [messenger, setMessenger] = useState<AdaptMessengerSchema>(InitialMessenger)

    const {messengerId, type, postId} = useParams()
    const user = useAppSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {
        socketRef,
        messagesList,
        setMessagesList,
    } = useMessageWS()

    const {getSignal} = useAbortController()

    useEffect(() => {
        if (!messengerId || !type) return
        const signal = getSignal()

        if (!types.includes(type) || !messengerId) {
            navigate("/")
            return
        }

        const handleMessageList = async () => {
            setMessagesList([])

            try {
                const [messenger, messages, reactions] = await Promise.all([
                    fetchMessengerApi(user.userId, type, messengerId, signal),
                    fetchMessagesApi(user.userId, type, messengerId, postId, signal),
                    getReactionsApi((type === 'channel' && messengerId) ? messengerId : undefined, signal)
                ])

                const adaptMessenger = mapMessengerDTO(messenger.data)

                if (!!adaptMessenger.id) {
                    setMessenger(adaptMessenger)
                    setMessagesList(prev => [...prev, ...messages.data])
                    setReactions(reactions.data)
                }
            } catch (error) {
                const message = isServerError(error)

                dispatch(setPopupState(true))
                dispatch(setPopupChildren(message))
                navigate('/')
            }
        }

        handleMessageList()
    }, [user.userId, messengerId, postId])

    return {
        messenger,
        setMessenger,
        reactions,
        messagesList,
        setMessagesList,
        socketRef
    }
}

export default useFetchInitialData