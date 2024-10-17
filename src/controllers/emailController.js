import nodemailer from 'nodemailer'
import { config } from '../config/config.js'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: config.MAILER,
      pass: config.MAILER_PASS,
    }
  })

export const sendEmail = async ( to, subject, body, att = [] ) => {
  const mailOptions = {
    from: "Proyecto Backend coderhouse " + config.MAILER,
    to,
    subject,
    html: body,
    attachments: att
  }
  await transport.sendMail(mailOptions, (err, data) => {
    if (err) {
      return {
        code: 500,
        message: err.message
      }
    } else {
      return {
        code: 200,
        message: 'Correo enviado'
      }
    }
  })
}