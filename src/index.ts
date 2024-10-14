import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
const app = new Hono();
type mail = {
  subject: string;
  content: string;
  name: string;
  senderEmail: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: "465",
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SENDER_EMAIL as string, // generated ethereal user
    pass: process.env.PASS as string, // generated ethereal password
  },
} as SMTPTransport.MailOptions);

app.post("/", async (c) => {
  const message: mail = await c.req.json();
  console.log(message);
  try {
    const res = await send(
      message.content,
      message.subject,
      message.name,
      message.senderEmail
    );

    return c.json({ message: "Email sent successfully", info: res });
  } catch (error) {
    return c.json({ message: "Email sending failed", error }, 500);
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

const send = (
  content: string,
  subject: string,
  name: string,
  senderEmail: string
) => {
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
      if (error) return reject(error);
      return resolve(info);
    });
  });
};
