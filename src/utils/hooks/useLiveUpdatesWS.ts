import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@hooks/useRedux";
import {addMessenger, deleteMessenger, updateMessenger} from "@store/reducers/liveUpdatesReducer";

let socketInstance: WebSocket | null = null

export const useLiveUpdatesWS = () => {
    const userId = useAppSelector(state => state.user.userId)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (socketInstance && socketInstance.readyState <= 1) return
        socketInstance = new WebSocket("ws://localhost:5000/live-updates")

        socketInstance.onopen = () => {
            socketInstance?.send(JSON.stringify({
                user_id: userId,
                method: 'CONNECTION'
            }))
        }

        socketInstance.onmessage = (event) => {
            let message = JSON.parse(event.data)

            switch (message.method) {
                case 'CONNECTION':
                    break
                case 'JOIN_TO_MESSENGER':
                    dispatch(addMessenger(message.data))
                    break
                case 'REMOVE_FROM_MESSENGER':
                    dispatch(deleteMessenger(message.data))
                    break
                case 'UPDATE_LAST_MESSAGE':
                    const messageData = message.data
                    const currentMessengerId = window.location.pathname.split('/').pop()

                    dispatch(updateMessenger({
                        messenger_id: messageData.messenger_id,
                        message_text: messageData.message_text,
                        message_date: messageData.message_date,
                        isCurrentMessenger: messageData.messenger_id === currentMessengerId
                    }))
                    break
                default:
                    break
            }
        }

        socketInstance.onerror = (error) => {
            console.error("WebSocket Error:", error)
        }
    }, [dispatch, userId])

    return socketInstance
}