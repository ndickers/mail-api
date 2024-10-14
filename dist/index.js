"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const nodemailer_1 = __importDefault(require("nodemailer"));
const app = new hono_1.Hono();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.zoho.com",
    port: "465",
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SENDER_EMAIL, // generated ethereal user
        pass: process.env.PASS, // generated ethereal password
    },
});
app.post("/", async (c) => {
    const message = await c.req.json();
    console.log(message);
    try {
        const res = await send(message.content, message.subject, message.name, message.senderEmail);
        return c.json({ message: "Email sent successfully", info: res });
    }
    catch (error) {
        return c.json({ message: "Email sending failed", error }, 500);
    }
});
const port = 3000;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
const send = (content, subject, name, senderEmail) => {
    return new Promise((resolve, reject) => {
        if (!content)
            return reject(new Error("fail because mail content was empty"));
        const options = {
            from: `<${process.env.SENDER_EMAIL}>`,
            to: "bryondickers@gmail.com",
            subject,
            text: `Name: ${name}\nEmail: ${senderEmail}\n\n${content}`,
        };
        return transporter.sendMail(options, (error, info) => {
            if (error)
                return reject(error);
            return resolve(info);
        });
    });
};
