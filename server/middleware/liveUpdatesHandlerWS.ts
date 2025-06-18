import {WebSocketServer, WebSocket} from "ws";
import IFullMessenger from "../types/messengerTypes/IFullMessenger";

type WebSocketMethod =
    | "CONNECTION"
    | "JOIN_TO_MESSENGER"
    | "REMOVE_FROM_MESSENGER"
    | "UPDATE_LAST_MESSAGE"

interface IMessage<T, M extends WebSocketMethod> {
    user_id: string,
    method: M,
    data: T
}

interface ExtendedWebSocket extends WebSocket {
    user_id?: string
}

type ConnectionMessage = IMessage<IFullMessenger, "CONNECTION">
type JoinMessage = IMessage<IFullMessenger, "JOIN_TO_MESSENGER">
type RemoveMessage = IMessage<string, "REMOVE_FROM_MESSENGER">
type UpdateLastMessage = IMessage<IFullMessenger, "UPDATE_LAST_MESSAGE">

type IncomingMessage = | ConnectionMessage | JoinMessage | RemoveMessage | UpdateLastMessage

const liveUpdatesHandlerWS = (aWss: WebSocketServer) => {
    const onConnection = (ws: ExtendedWebSocket, message: ConnectionMessage) => {
        ws.user_id = message.user_id
        handleBroadcast(message)
    }

    const handleBroadcastToMembers = (message: JoinMessage | UpdateLastMessage) => {
        const {messenger_members, ...restData} = message.data
        if (!messenger_members || messenger_members.length <= 0) return

        const payload = JSON.stringify({
            method: message.method,
            data: restData
        })

        aWss.clients.forEach((client: ExtendedWebSocket) => {
            if (!client.user_id) return

            if (messenger_members.includes(client.user_id)) {
                client.send(payload)
            }
        })
    }

    const handleBroadcast = (message: RemoveMessage | ConnectionMessage) => {
        const payload = JSON.stringify({
            method: message.method,
            data: message.data
        })

        aWss.clients.forEach((client: ExtendedWebSocket) => {
            if (!client.user_id) return

            if (client.user_id === message.user_id) {
                client.send(payload)
            }
        })
    }

    return (ws: ExtendedWebSocket) => {
        ws.on('message', (messageBuffer: Buffer) => {
            try {
                const message: IncomingMessage = JSON.parse(messageBuffer.toString())

                switch (message.method) {
                    case 'CONNECTION':
                        onConnection(ws, message)
                        break
                    case "JOIN_TO_MESSENGER":
                        handleBroadcastToMembers(message)
                        break
                    case "UPDATE_LAST_MESSAGE":
                        handleBroadcastToMembers(message)
                        break
                    case "REMOVE_FROM_MESSENGER":
                        handleBroadcast(message)
                        break
                    default:
                        const exhaustiveCheck: never = message
                        return exhaustiveCheck
                }
            } catch (e) {
                console.error("Live Updates WebSocket message handling error: ", e);
            }
        })
    }
}

export default liveUpdatesHandlerWS