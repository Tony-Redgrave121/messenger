import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"

class MailService {
    transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_APP_PASSWORD
            }
        } as SMTPTransport.Options)
    }

    async sendMail(to: string, code: number) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Email confirmation",
            text: "",
            html: `
                <!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>AI Blog</title></head><body style="background-color:#141414;margin:0;padding:0;font-family:Inter,sans-serif;color:#fff;box-sizing:border-box"><div style="width:100%;padding:15px;border-bottom:1px solid #262626;text-align:center;box-sizing:border-box"><a href="http://localhost:3000/"><h1 style="display:inline-block;font-size:34px;color:#ffd11a">FutureTech</h1></a></div><div style="padding:40px;box-sizing:border-box"><h1 style="text-align:center">Activate Your Account</h1><p style="font-size:18px;color:#666;text-align:center">Thank you for registering! Please click the button below to activate your account.</p><span style="text-align:center;display:block;width:100%"><a href="${code}" style="font-size:18px;color:white;cursor:pointer;transition:.2s all ease-in-out;border:1px solid #262626;border-radius:10px;padding:14px 24px;text-decoration:none;display:inline-block">Activate Account</a></span><p style="font-size:18px;color:#666;text-align:center">If you didn’t request this, please ignore this email.</p></div></body></html>
            `
        })
    }
}

export default new MailService()