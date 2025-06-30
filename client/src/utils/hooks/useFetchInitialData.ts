import {useEffect, useState} from "react"
import {IAdaptMessenger, IReaction} from "@appTypes";
import {setPopupMessageChildren, setPopupMessageState} from "@store/reducers/appReducer";
import {useNavigate, useParams} from "react-router-dom";
import {isServerError, useAppDispatch, useAppSelector} from "../../rebuild/shared/lib";
import {useMessageWS} from "@utils/hooks/useMessageWS";
import MessageService from "../../services/MessageService";
import MessengerManagementService from "../../services/MessengerManagementService";
import {useAbortController} from "../../rebuild/shared/lib";

const types = ['chat', 'channel', 'group']

const InitialMessenger: IAdaptMessenger = {
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
    const [reactions, setReactions] = useState<IReaction[]>([])
    const [messenger, setMessenger] = useState<IAdaptMessenger>(InitialMessenger)

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
                    MessengerManagementService.fetchMessenger(user.userId, type, messengerId, signal),
                    MessageService.fetchMessages(user.userId, type, messengerId, postId, signal),
                    MessengerManagementService.getReactions((type === 'channel' && messengerId) ? messengerId : undefined, signal)
                ])

                const messengerData = messenger.data
                let adaptMessenger = InitialMessenger

                if ("user_id" in messengerData) {
                    adaptMessenger = {
                        id: messengerData.user_id,
                        name: messengerData.user_name,
                        image: messengerData.user_img,
                        desc: messengerData.user_bio,
                        type: 'chat',
                        last_seen: messengerData.user_last_seen,
                    }
                } else if ("messenger_id" in messengerData) {
                    adaptMessenger = {
                        id: messengerData.messenger_id,
                        name: messengerData.messenger_name,
                        image: messengerData.messenger_image,
                        desc: messengerData.messenger_desc,
                        type: messengerData.messenger_type,
                        members: messengerData.user_member,
                        members_count: messengerData.members_count,
                    }
                }

                if (!!adaptMessenger.id) {
                    setMessenger(adaptMessenger)
                    setMessagesList(prev => [...prev, ...messages.data])
                    setReactions(reactions.data)
                }
            } catch (error) {
                const message = isServerError(error)

                dispatch(setPopupMessageState(true))
                dispatch(setPopupMessageChildren(message))
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