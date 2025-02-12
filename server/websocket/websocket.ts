import ws from 'ws'
import dotenv from "dotenv"
dotenv.config({path: "../.env"})

const PORT = Number(process.env.WEBSOCKET_SERVER_PORT)
const wss = new ws.Server({
    port: PORT
}, () => console.log(`WebSocket Server started on ${PORT}`))

// wss.on('connection', (ws) => {
//     ws.on('message', (message  ) => {
//         message = JSON.parse(message)
//
//         switch (message as any) {
//             case 'message':
//                 broadcastMessage()
//         }
//     })
// })
//
// const broadcastMessage = (message) => {
//     wss.clients.forEach(client => {
//         client.send(message)
//     })
// }