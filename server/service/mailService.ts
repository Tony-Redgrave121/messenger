import nodemailer, {Transporter} from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"
import ApiError from "../error/ApiError";

interface IConfig {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string
    }
}

class MailService {
    private transporter: Transporter

    constructor(config: IConfig) {
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.auth.user,
                pass: config.auth.pass
            }
        } as SMTPTransport.Options)
    }

    async sendMail(to: string, code: number) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Email confirmation',
                html: this.buildHtml(code)
            })
        } catch (e) {
            throw ApiError.internalServerError('Failed to send email')
        }
    }

    private buildHtml(code: number) {
        return `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Confirmation</title>
            </head>
            <body style="background-color:#1c1c1c; font-family:Inter, sans-serif; color:#fff; padding:20px;">
                <div style="text-align:center;">
                    <h1 style="color:#ffffff;">Messenger</h1>
                    <h2>Email Confirmation</h2>
                    <p style="color:#aaa;">Enter this code to confirm your email:</p>
                    <p style="font-size:24px; letter-spacing:5px; border:1px solid #282828; border-radius:10px; padding:14px 24px; display:inline-block;">${code}</p>
                    <p style="color:#888; margin-top:20px;">If you didn’t request this, please ignore this email.</p>
                </div>
            </body>
            </html>
        `
    }
}

export default MailService