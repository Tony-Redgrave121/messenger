import express from 'express'
import dotenv from 'dotenv'
import sequelize from './database/db'
import index from "./routes"
import errorHandler from './middlewares/errorHandler'
import fileUpload from 'express-fileupload'
import * as path from "path"
import cors from 'cors'
import cookieParser from "cookie-parser"
import helmet from 'helmet'
import compression from 'compression'
import expressWs from "express-ws"
import messengerHandlerWS from "./middlewares/messengerHandlerWS";
import liveUpdatesHandlerWS from "./middlewares/liveUpdatesHandlerWS";

dotenv.config({path: "./.env"})
const PORT = Number(process.env.SERVER_PORT)

const wsInstance = expressWs(express())
const {app} = wsInstance
const aWss = wsInstance.getWss()

app.use(compression())
app.use(express.json())
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: {policy: "cross-origin"},
    referrerPolicy: {policy: "no-referrer"},
    xContentTypeOptions: true,
    xDnsPrefetchControl: true,
    hidePoweredBy: true
}))
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/static', express.static(path.join(__dirname, '../static'), {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
}))
app.use(fileUpload({}))
app.use(cookieParser())
app.use(index)
app.use(errorHandler)

app.ws("/messenger", messengerHandlerWS(aWss))
app.ws("/live-updates", liveUpdatesHandlerWS(aWss))

const startServer = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

startServer()
