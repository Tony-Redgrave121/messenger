import express from 'express'
import dotenv from 'dotenv'
import sequelize from '../db'
import router from "../routes/router"
import errorHandler from '../middleware/errorHandler'
import fileUpload from 'express-fileupload'
import * as path from "path"
import cors from 'cors'
import cookieParser from "cookie-parser"
import helmet from 'helmet'
import compression from 'compression'
import expressWs from "express-ws"
import IMessagesResponse from "../types/IMessagesResponse";

dotenv.config({path: "./.env"})
const PORT = Number(process.env.SERVER_PORT)

const wsInstance = expressWs(express())
const {app} = wsInstance
const aWss = wsInstance.getWss()

app.use(compression())
app.use(express.json())
app.use(helmet({
    contentSecurityPolicy: false,
    xXssProtection: false,
    xContentTypeOptions: true
}))
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/static', express.static(path.resolve(__dirname, 'static'), {
    setHeaders: (res, _) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000')
    }
}))
app.use(fileUpload({}))
app.use(cookieParser())
app.use(router)
app.use(errorHandler)

interface IMessage {
    messenger_id: string,
    user_id: string,
    method: string,
    data: IMessagesResponse
}

const connectionHandler = (ws: any, message: IMessage) => {
    ws.id = message.messenger_id
    broadcastConnection(message)
}

const broadcastConnection = (message: IMessage) => {
    aWss.clients.forEach((client: any) => {
        if (client.id === message.messenger_id) {
            client.send(JSON.stringify(message))
        }
    })
}

const handleMessage = (message: IMessage, method: string) => {
    aWss.clients.forEach((client: any) => {
        if (client.id === message.messenger_id) {
            client.send(JSON.stringify({
                method: method,
                data: message.data
            }))
        }
    })
}

app.ws('/', (ws) => {
    ws.on('message', (message: Buffer) => {
        const data = JSON.parse(message.toString())

        switch (data.method) {
            case 'CONNECTION':
                connectionHandler(ws, data)
                break
            case 'POST_MESSAGE':
                handleMessage(data, 'POST_MESSAGE')
                break
            case 'REMOVE_MESSAGE':
                handleMessage(data, 'REMOVE_MESSAGE')
                break
        }
    })
})

const startServer = async () => {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

startServer()
