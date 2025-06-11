import { WebSocketServer, WebSocket } from "ws";
import IFullMessenger from "../types/IFullMessenger";

const liveUpdatesHandlerWS = (aWss: WebSocketServer) => {
    interface IUpdateConfig {
        user_id: string,
        method: string,
        data: IFullMessenger
    }

    interface UserWebSocket extends WebSocket {
        user_id?: string
    }

    const connectionUpdateHandler = (ws: UserWebSocket, config: IUpdateConfig) => {
        ws.user_id = config.user_id
        broadcastUpdate(config)
    }

    const broadcastUpdate = (config: IUpdateConfig) => {
        aWss.clients.forEach((client: UserWebSocket) => {
            if (!client.user_id) return

            if (client.user_id === config.user_id) {
                client.send(JSON.stringify(config))
            }
        })
    }

    const handleMessengerJoining  = (messenger: IUpdateConfig, method: string) => {
        aWss.clients.forEach((client: UserWebSocket) => {
            if (!client.user_id || !messenger.data.messenger_members) return

            if (messenger.data.messenger_members.includes(client.user_id)) {
                client.send(JSON.stringify({
                    method: method,
                    data: messenger.data
                }))
            }
        })
    }

    return (ws: WebSocket) => {
        ws.on('message', (message: Buffer) => {
            const data = JSON.parse(message.toString())

            switch (data.method) {
                case 'CONNECTION':
                    connectionUpdateHandler(ws, data)
                    break
                case 'JOIN_TO_MESSENGER':
                    handleMessengerJoining(data, 'JOIN_TO_MESSENGER')
                    break
            }
        })

        ws.on('error', (err) => console.error('WebSocket помилка:', err));
    }
}

export default liveUpdatesHandlerWS