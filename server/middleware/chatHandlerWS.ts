import { WebSocketServer, WebSocket } from "ws";
import IMessagesResponse from "../types/IMessagesResponse";

const chatHandlerWS = (aWss: WebSocketServer) => {
    interface IMessage {
        messenger_id: string,
        user_id: string,
        method: string,
        data: IMessagesResponse
    }

    const connectionChatHandler = (ws: any, message: IMessage) => {
        ws.id = message.messenger_id
        broadcastChatConnection(message)
    }

    const broadcastChatConnection = (message: IMessage) => {
        aWss.clients.forEach((client: any) => {
            if (client.id === message.messenger_id || client.id === message.user_id) {
                client.send(JSON.stringify(message))
            }
        })
    }

    const handleMessage = (message: IMessage, method: string) => {
        aWss.clients.forEach((client: any) => {
            if (client.id === message.messenger_id || client.id === message.user_id) {
                client.send(JSON.stringify({
                    method: method,
                    data: message.data
                }))
            }
        })
    }

    return (ws: WebSocket) => {
        ws.on('message', (message: Buffer) => {
            const data = JSON.parse(message.toString())

            switch (data.method) {
                case 'CONNECTION':
                    connectionChatHandler(ws, data)
                    break
                case 'POST_MESSAGE':
                    handleMessage(data, 'POST_MESSAGE')
                    break
                case 'REMOVE_MESSAGE':
                    handleMessage(data, 'REMOVE_MESSAGE')
                    break
            }
        })
    }
}

export default chatHandlerWS