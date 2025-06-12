import {WebSocketServer, WebSocket} from "ws";
import IFullMessenger from "../types/IFullMessenger";

const liveUpdatesHandlerWS = (aWss: WebSocketServer) => {
    type ILiveUpdateConfig<T> = {
        user_id: string,
        method: string,
        data: T
    }

    interface UserWebSocket extends WebSocket {
        user_id?: string
    }

    const connectionUpdateHandler = (ws: UserWebSocket, config: ILiveUpdateConfig<IFullMessenger>) => {
        ws.user_id = config.user_id
        broadcastUpdate(config)
    }

    const broadcastUpdate = (config: ILiveUpdateConfig<IFullMessenger>) => {
        aWss.clients.forEach((client: UserWebSocket) => {
            if (!client.user_id) return

            if (client.user_id === config.user_id) {
                client.send(JSON.stringify(config))
            }
        })
    }

    const joinToMessenger = (messenger: ILiveUpdateConfig<IFullMessenger>, method: string) => {
        aWss.clients.forEach((client: UserWebSocket) => {
            const {messenger_members, ...restData} = messenger.data
            if (!messenger_members.length) return

            messenger.data.messenger_members.map(memberId => {
                if (!client.user_id) return

                if (client.user_id === memberId) {
                    client.send(JSON.stringify({
                        method: method,
                        data: restData
                    }))
                }
            })
        })
    }

    const removeFromMessenger = (messenger: ILiveUpdateConfig<string>, method: string) => {
        aWss.clients.forEach((client: UserWebSocket) => {
            if (!client.user_id) return

            if (client.user_id === messenger.user_id) {
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
                    joinToMessenger(data, 'JOIN_TO_MESSENGER')
                    break
                case 'REMOVE_FROM_MESSENGER':
                    removeFromMessenger(data, 'REMOVE_FROM_MESSENGER')
                    break
            }
        })

        ws.on('error', (err) => console.error('WebSocket помилка: ', err));
    }
}

export default liveUpdatesHandlerWS