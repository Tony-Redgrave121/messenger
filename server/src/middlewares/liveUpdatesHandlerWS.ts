import {WebSocketServer, WebSocket} from "ws";
import IFullMessenger from "../types/messengerTypes/IFullMessenger";
import index from "../models";
import ApiError from "../errors/apiError";

type WebSocketMethod =
    | "CONNECTION"
    | "JOIN_TO_MESSENGER"
    | "REMOVE_FROM_MESSENGER"
    | "UPDATE_LAST_MESSAGE"
    | "PING"
    | "EXIT"

interface IMessage<T, M extends WebSocketMethod> {
    user_id: string,
    method: M,
    data: T
}

interface ExtendedWebSocket extends WebSocket {
    user_id?: string
}

interface ILastSeenData {
    messenger_members: string[],
    userId: string,
    date: string,
}

type ConnectionMessage = IMessage<IFullMessenger, "CONNECTION">
type JoinMessage = IMessage<IFullMessenger, "JOIN_TO_MESSENGER">
type RemoveMessage = IMessage<string, "REMOVE_FROM_MESSENGER">
type UpdateLastMessage = IMessage<IFullMessenger, "UPDATE_LAST_MESSAGE">
type UpdateLastSeen = IMessage<ILastSeenData, "PING">
type Exit = IMessage<ILastSeenData, "EXIT">

type IncomingMessage = | ConnectionMessage | JoinMessage | RemoveMessage | UpdateLastMessage | UpdateLastSeen | Exit

const liveUpdatesHandlerWS = (aWss: WebSocketServer) => {
    const onConnection = (ws: ExtendedWebSocket, message: RemoveMessage | ConnectionMessage) => {
        ws.user_id = message.user_id
        handleBroadcast(message)
    }

    const updateLastSeen = async (userId: string) => {
        const user = await index.users.findOne({where: {user_id: userId}})
        if (!user) throw ApiError.notFound(`User not found`)

        await index.users.update({user_last_seen: new Date()}, {where: {user_id: userId}})
    }

    const handleBroadcastToMembers = (message: JoinMessage | UpdateLastMessage | UpdateLastSeen) => {
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
                    case 'PING':
                        handleBroadcastToMembers(message)
                        updateLastSeen(message.user_id)
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
                    case "EXIT":
                        setTimeout(() => handleBroadcastToMembers({
                            ...message,
                            method: "PING"
                        }), 15000)
                        break
                    default:
                        const exhaustiveCheck: never = message
                        return exhaustiveCheck
                }
            } catch (e) {
                console.error("Live Updates WebSocket Message handling errors: ", e);
            }
        })
    }
}

export default liveUpdatesHandlerWS