import {useEffect, useRef, useState} from "react";
import {useAppSelector} from "@hooks/useRedux";
import {IMessagesResponse} from "@appTypes";
import {useParams} from "react-router-dom";

export const useMessageWS = () => {
    const [messagesList, setMessagesList] = useState<IMessagesResponse[]>([])

    const socketRef = useRef<WebSocket | null>(null)
    const user = useAppSelector(state => state.user)
    const {id} = useParams()

    useEffect(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) socketRef.current.close()

        socketRef.current = new WebSocket("ws://localhost:5000/chat")
        const socket = socketRef.current

        socket.onopen = () => {
            socket.send(JSON.stringify({
                messenger_id: id,
                user_id: user.userId,
                method: 'CONNECTION'
            }))
        }

        socket.onmessage = (event) => {
            let message = JSON.parse(event.data)

            switch (message.method) {
                case 'CONNECTION':
                    break
                case 'POST_MESSAGE':
                    setMessagesList(prev => [...prev, message.data])
                    break
                case 'REMOVE_MESSAGE':
                    setMessagesList(prev => prev.filter(msg => msg.message_id !== message.data))
                    break
                default:
                    break
            }
        }

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error)
        }

        return () => {
            if (socket.readyState === 1) socket.close()
        }
    }, [id, user.userId])

    return {
        socketRef,
        messagesList,
        setMessagesList
    }
}