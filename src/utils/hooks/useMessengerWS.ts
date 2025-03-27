import {useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "./useRedux";
import {setMessengersList} from "../../store/reducers/appReducer";

export const useMessengerWS = () => {
    const socketRef = useRef<WebSocket | null>(null)
    const userId = useAppSelector(state => state.user.userId)
    const dispatch = useAppDispatch()

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:5000/live-updates")
        const socket = socketRef.current

        socket.onopen = () => {
            socket.send(JSON.stringify({
                user_id: userId,
                method: 'CONNECTION'
            }))
        }

        socket.onmessage = (event) => {
            let message = JSON.parse(event.data)
            console.log(message)

            switch (message.method) {
                case 'CONNECTION':
                    break
                case 'GET_MESSENGERS':
                    dispatch(setMessengersList(message.data))
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
    }, [dispatch, userId])

    return socketRef
}