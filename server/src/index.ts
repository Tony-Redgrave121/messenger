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
import messengerHandlerWS from "../middleware/messengerHandlerWS";
import liveUpdatesHandlerWS from "../middleware/liveUpdatesHandlerWS";

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
        res.setHeader('Cache-Control', 'no-cache')
    }
}))
app.use(fileUpload({}))
app.use(cookieParser())
app.use(router)
app.use(errorHandler)

app.ws("/chat", messengerHandlerWS(aWss))
app.ws("/live-updates", liveUpdatesHandlerWS(aWss))

const startServer = async () => {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

startServer()
