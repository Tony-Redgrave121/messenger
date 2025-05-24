import { WebSocketServer, WebSocket } from "ws";
import IMessagesResponse from "../types/IMessagesResponse";

const commentsHandlerWS = (aWss: WebSocketServer) => {
    interface IComment {
        post_id: string,
        user_id: string,
        method: string,
        data: IMessagesResponse
    }

    const connectionCommentsHandler = (ws: any, message: IComment) => {
        ws.id = message.post_id
        broadcastCommentsConnection(message)
    }

    const broadcastCommentsConnection = (message: IComment) => {
        aWss.clients.forEach((client: any) => {
            if (client.id === message.post_id) {
                client.send(JSON.stringify(message))
            }
        })
    }

    const handleComment = (message: IComment, method: string) => {
        aWss.clients.forEach((client: any) => {
            if (client.id === message.post_id) {
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
                    connectionCommentsHandler(ws, data)
                    break
                case 'POST_COMMENT':
                    handleComment(data, 'POST_COMMENT')
                    break
                case 'REMOVE_COMMENT':
                    handleComment(data, 'REMOVE_COMMENT')
                    break
            }
        })
    }
}

export default commentsHandlerWS