import {WebSocketServer, WebSocket} from "ws";
import IMessagesResponse from "../types/messageTypes/IMessagesResponse";

type WebSocketMethod =
    | "CONNECTION"
    | "POST_MESSAGE"
    | "ADD_REACTION"
    | "REMOVE_REACTION"
    | "EDIT_MESSAGE"
    | "REMOVE_MESSAGE"

interface IMessage {
    messenger_id: string,
    user_id: string,
    method: WebSocketMethod,
    data: IMessagesResponse
}

interface ExtendedWebSocket extends WebSocket {
    messenger_id?: string;
}

const messengerHandlerWS = (aWss: WebSocketServer) => {
    const onConnection = (ws: ExtendedWebSocket, message: IMessage) => {
        ws.messenger_id = message.messenger_id
        handleBroadcast(message)
    }

    const handleBroadcast = (message: IMessage) => {
        const payload = JSON.stringify({
            method: message.method,
            data: message.data
        })

        aWss.clients.forEach((client: ExtendedWebSocket) => {
            if (client.messenger_id === message.messenger_id || client.messenger_id === message.user_id) {
                client.send(payload)
            }
        })
    }

    return (ws: ExtendedWebSocket) => {
        ws.on('message', (messageBuffer: Buffer) => {
            try {
                const message: IMessage = JSON.parse(messageBuffer.toString())

                switch (message.method) {
                    case "CONNECTION":
                        onConnection(ws, message);
                        break
                    case "POST_MESSAGE":
                    case "ADD_REACTION":
                    case "REMOVE_REACTION":
                    case "EDIT_MESSAGE":
                    case "REMOVE_MESSAGE":
                        handleBroadcast(message)
                        break
                    default:
                        const exhaustiveCheck: never = message.method
                        return exhaustiveCheck
                }
            } catch (e) {
                console.error("Messenger WebSocket Message handling errors: ", e);
            }
        })
    }
}

export default messengerHandlerWS