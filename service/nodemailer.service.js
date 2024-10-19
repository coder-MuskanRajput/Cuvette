import TemplateModel from "../models/template.model.js";
import dotenv from 'dotenv';
import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'

dotenv.config({path:'.env'})


export const sendMail = async ( templateName = '', context = '', message = '', from, to, subject = '') => {
    if (!process.env.MAIL_EMAIL_ADDRESS || !process.env.MAIL_PASSWORD) {
        throw "Mail credentials are not set."
    }

    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAIL_EMAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    try {
        let template = await TemplateModel.findOne({ name: templateName });
        if (!template && !message) {
            throw "Template and mail details not found."
        }
        console.log('----------', to)
        if (message && message?.message) {
            template = {
                subject: subject || message.subject,
                body:message.message
            }
        }
        console.log('----------', from)
        const compiledTemplate = Handlebars.compile(template.body);
        const html = compiledTemplate({ ...context });

        const mailOptions = {
            from: from,
            to: to,
            subject: subject || template.subject || "",
            html: html,
        };

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                throw err.response || 'Failed to send email'
            }
            console.log('Email sent');
            return true
        });
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
};
